#!/usr/bin/env node

/**
 * Deployment Readiness Check
 * Verifies all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'DEPLOY_CLOUDFLARE.md',
  'DEPLOY_CHECKLIST.md',
  'START-DEPLOYMENT.md',
  'README.md',
  'VPS_DEPLOY_INSTRUCTIONS.md',
  'supabase/REGISTERED_USERS.sql',
  'frontend/.env.example',
  'frontend/proxy.ts',
  'frontend/app/lib/supabaseClient.ts',
  'frontend/app/hooks/useAuth.tsx',
  'frontend/app/dashboard/page.tsx',
  'frontend/app/admin/page.tsx',
  'frontend/package.json',
  'backend/src/index.ts',
  'backend/package.json',
];

const REQUIRED_FRONTEND_DEPS = [
  '@supabase/supabase-js',
  'next',
  'react',
  'react-dom',
];

console.log('🔍 Checking deployment readiness...\n');

let allChecks = true;

// Check required files
console.log('📁 Checking required files:');
REQUIRED_FILES.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) allChecks = false;
});

// Check frontend dependencies
console.log('\n📦 Checking frontend dependencies:');
const frontendPkg = require('../frontend/package.json');
REQUIRED_FRONTEND_DEPS.forEach(dep => {
  const exists = frontendPkg.dependencies && frontendPkg.dependencies[dep];
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${dep}`);
  if (!exists) allChecks = false;
});

// Check documentation completeness
console.log('\n📖 Checking documentation:');
const deployCloudflare = fs.readFileSync(path.join(__dirname, '..', 'DEPLOY_CLOUDFLARE.md'), 'utf8');
const hasSupabaseSteps = deployCloudflare.includes('Supabase');
const hasCloudflareSteps = deployCloudflare.includes('Cloudflare Pages');
const hasDomainSteps = deployCloudflare.includes('Custom domains');

console.log(`${hasSupabaseSteps ? '✅' : '❌'} Supabase setup instructions`);
console.log(`${hasCloudflareSteps ? '✅' : '❌'} Cloudflare Pages instructions`);
console.log(`${hasDomainSteps ? '✅' : '❌'} Domain configuration steps`);

if (!hasSupabaseSteps || !hasCloudflareSteps || !hasDomainSteps) allChecks = false;

// Check SQL file
console.log('\n🗄️ Checking Supabase SQL:');
const sqlFile = fs.readFileSync(path.join(__dirname, '..', 'supabase/REGISTERED_USERS.sql'), 'utf8');
const hasTable = sqlFile.includes('create table');
const hasRLS = sqlFile.includes('row level security');
const hasTrigger = sqlFile.includes('create trigger');

console.log(`${hasTable ? '✅' : '❌'} Table creation`);
console.log(`${hasRLS ? '✅' : '❌'} Row-level security`);
console.log(`${hasTrigger ? '✅' : '❌'} Auto-insert trigger`);

if (!hasTable || !hasRLS || !hasTrigger) allChecks = false;

// Final summary
console.log('\n' + '='.repeat(50));
if (allChecks) {
  console.log('✅ All checks passed! Ready for deployment.');
  console.log('\n📖 Next steps:');
  console.log('   1. Open DEPLOY_CHECKLIST.md');
  console.log('   2. Follow the Supabase setup');
  console.log('   3. Deploy to Cloudflare Pages');
  console.log('   4. Add custom domains\n');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Review the output above.');
  console.log('\n🔧 Fix the issues and run this script again.\n');
  process.exit(1);
}
