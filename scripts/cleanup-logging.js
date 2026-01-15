const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Production logging configuration
const productionLogger = `
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add console transport in development only
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
`;

// Create logger utility
fs.writeFileSync(
  path.join(process.cwd(), 'src/utils/logger.ts'),
  productionLogger
);

// Update package.json to add winston
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
);

if (!packageJson.dependencies.winston) {
  packageJson.dependencies.winston = '^3.11.0';
  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

// Install dependencies
console.log('Installing winston...');
execSync('npm install');

// Patterns to replace
const replacements = [
  {
    from: /console\.log\(/g,
    to: 'logger.info('
  },
  {
    from: /console\.error\(/g,
    to: 'logger.error('
  },
  {
    from: /console\.warn\(/g,
    to: 'logger.warn('
  },
  {
    from: /console\.debug\(/g,
    to: 'logger.debug('
  }
];

// Function to process a file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Add logger import if file contains console statements
  if (content.includes('console.')) {
    content = `import logger from '../utils/logger';\n${content}`;
    modified = true;
  }

  // Replace console statements
  replacements.forEach(({ from, to }) => {
    if (content.match(from)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

// Recursively process all TypeScript files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts')) {
      processFile(filePath);
    }
  });
}

// Start processing from src directory
console.log('Converting console statements to winston logger...');
processDirectory(path.join(process.cwd(), 'src'));

console.log('Logging cleanup complete!');
console.log('Next steps:');
console.log('1. Review changes in git diff');
console.log('2. Update environment variables:');
console.log('   - LOG_LEVEL=info (or debug/warn/error)');
console.log('3. Test logging in development');
console.log('4. Verify log files are created correctly');
