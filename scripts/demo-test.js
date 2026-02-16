const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.DEMO_BACKEND_URL || 'http://127.0.0.1:4000';

function requestJson(urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `${BACKEND_URL}${urlPath}`,
      { method: 'GET', timeout: 2000 },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('timeout'));
    });
    req.end();
  });
}

async function waitForHealth({ timeoutMs = 30000, intervalMs = 500 } = {}) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await requestJson('/health');
      if (res.status === 200) return;
    } catch {
      // ignore until timeout
    }

    if (Date.now() - start > timeoutMs) {
      throw new Error(`Backend not healthy at ${BACKEND_URL}/health after ${timeoutMs}ms`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

function getNpmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function spawnBackend(env) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/d', '/s', '/c', 'npm --prefix backend run dev'], {
      stdio: 'inherit',
      env,
      windowsHide: true
    });
  }

  return spawn(getNpmCommand(), ['--prefix', 'backend', 'run', 'dev'], {
    stdio: 'inherit',
    env
  });
}

function killProcessTree(child) {
  if (!child || child.killed) return;

  if (process.platform === 'win32') {
    spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    return;
  }

  child.kill('SIGTERM');
}

function hasBackendDeps() {
  const binName = process.platform === 'win32' ? 'ts-node-dev.cmd' : 'ts-node-dev';
  const binPath = path.join(__dirname, '..', 'backend', 'node_modules', '.bin', binName);
  return fs.existsSync(binPath);
}

async function ensureBackendDeps() {
  if (hasBackendDeps()) return;

  console.log('📦 Installing backend dependencies (one-time)...');
  await new Promise((resolve, reject) => {
    const installProc =
      process.platform === 'win32'
        ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm --prefix backend install'], {
            stdio: 'inherit',
            windowsHide: true
          })
        : spawn(getNpmCommand(), ['--prefix', 'backend', 'install'], { stdio: 'inherit' });

    installProc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`backend npm install failed with code ${code}`));
    });
    installProc.on('error', reject);
  });
}

async function run() {
  console.log('🧪 demo:test starting');
  console.log(`   backend: ${BACKEND_URL}`);

  let backendProc = null;
  let startedBackend = false;

  try {
    // If a backend is already running, don't start/stop it.
    try {
      await waitForHealth({ timeoutMs: 1500, intervalMs: 300 });
      console.log('✅ Backend already running');
    } catch {
      await ensureBackendDeps();
      console.log('▶ Starting backend (dev) with DEMO_SEED=true');
      startedBackend = true;
      const backendEnv = {
        ...process.env,
        DEMO_SEED: 'true',
        PORT: process.env.PORT || '4000',
        JWT_SECRET: process.env.JWT_SECRET || 'demo-secret'
      };

      backendProc = spawnBackend(backendEnv);

      await waitForHealth();
      console.log('✅ Backend healthy');
    }

    console.log('▶ Running backend/test-api.js');
    await new Promise((resolve, reject) => {
      const proc = spawn(process.execPath, ['backend/test-api.js'], { stdio: 'inherit' });
      proc.on('exit', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`test-api.js exited with code ${code}`));
      });
      proc.on('error', reject);
    });

    console.log('🎉 demo:test passed');
  } finally {
    if (startedBackend && backendProc) {
      console.log('⏹ Stopping backend');
      killProcessTree(backendProc);
    }
  }
}

run().catch((err) => {
  console.error('❌ demo:test failed:', err.message);
  process.exit(1);
});
