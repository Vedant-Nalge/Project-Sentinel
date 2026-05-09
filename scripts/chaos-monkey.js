/**
 * Chaos Monkey - Random Bug Injection Script
 * Injects 5 types of bugs into the microservices
 */

const fs = require('fs');
const path = require('path');

const BUG_TYPES = {
  SYNTAX_ERROR: 'syntax_error',
  TYPE_MISMATCH: 'type_mismatch',
  LOGIC_ERROR: 'logic_error',
  MISSING_DEPENDENCY: 'missing_dependency',
  CORRUPTED_JSON: 'corrupted_json'
};

const services = ['auth-service', 'payment-service', 'inventory-service', 'notification-service'];

const SYNTAX_ERRORS = [
  { pattern: 'const ', replacement: 'conts ', file: 'src/index.ts' },
  { pattern: 'function', replacement: 'functio', file: 'src/index.ts' },
  { pattern: 'return', replacement: 'retur', file: 'src/index.ts' },
  { pattern: 'async', replacement: 'asycn', file: 'src/index.ts' },
  { pattern: 'export', replacement: 'exprot', file: 'src/index.ts' }
];

const TYPE_MISMATCHES = [
  { pattern: 'string', replacement: 'number', file: 'src/index.ts', context: 'status: string' },
  { pattern: 'number', replacement: 'boolean', file: 'src/index.ts', context: 'count: number' },
  { pattern: 'boolean', replacement: 'string', file: 'src/index.ts', context: 'enabled: boolean' },
  { pattern: 'null', replacement: 'undefined', file: 'src/index.ts', context: '= null' }
];

const LOGIC_ERRORS = [
  { pattern: '===', replacement: '!==', file: 'src/index.ts' },
  { pattern: '==', replacement: '!=', file: 'src/index.ts' },
  { pattern: '&&', replacement: '||', file: 'src/index.ts' },
  { pattern: '>=', replacement: '<=', file: 'src/index.ts' },
  { pattern: 'if (', replacement: 'if (!', file: 'src/index.ts' }
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function injectSyntaxError(serviceDir) {
  const target = getRandomItem(SYNTAX_ERRORS);
  const filePath = path.join(serviceDir, target.file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(target.pattern, target.replacement);
    fs.writeFileSync(filePath, content);
    return `Injected syntax error: ${target.file} (${target.pattern} -> ${target.replacement})`;
  } catch (e) {
    return `Failed to inject syntax error: ${e.message}`;
  }
}

function injectTypeMismatch(serviceDir) {
  const target = getRandomItem(TYPE_MISMATCHES);
  const filePath = path.join(serviceDir, target.file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(target.context, target.context.replace(target.pattern, target.replacement));
    fs.writeFileSync(filePath, content);
    return `Injected type mismatch: ${target.file} (${target.pattern} -> ${target.replacement})`;
  } catch (e) {
    return `Failed to inject type mismatch: ${e.message}`;
  }
}

function injectLogicError(serviceDir) {
  const target = getRandomItem(LOGIC_ERRORS);
  const filePath = path.join(serviceDir, target.file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(target.pattern, target.replacement);
    fs.writeFileSync(filePath, content);
    return `Injected logic error: ${target.file} (${target.pattern} -> ${target.replacement})`;
  } catch (e) {
    return `Failed to inject logic error: ${e.message}`;
  }
}

function injectMissingDependency(serviceDir) {
  const pkgPath = path.join(serviceDir, 'package.json');

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const deps = Object.keys(pkg.dependencies || {});

    if (deps.length > 0) {
      const randomDep = getRandomItem(deps);
      delete pkg.dependencies[randomDep];
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      return `Removed dependency: ${randomDep}`;
    }
    return 'No dependencies to remove';
  } catch (e) {
    return `Failed to inject dependency issue: ${e.message}`;
  }
}

function injectCorruptedJson(serviceDir) {
  const targetFiles = ['config.json', 'settings.json', 'data.json'];
  const target = getRandomItem(targetFiles);

  try {
    const filePath = path.join(serviceDir, target);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const corrupted = content.slice(0, Math.floor(content.length / 2)) + '\n!!!CORRUPTED';
      fs.writeFileSync(filePath, corrupted);
      return `Corrupted JSON: ${target}`;
    }
    return `File ${target} does not exist`;
  } catch (e) {
    return `Failed to corrupt JSON: ${e.message}`;
  }
}

function runChaos() {
  console.log('🔥 CHAOS MONKEY STARTING...\n');

  const servicesDir = path.join(__dirname, '..', 'services');
  const selectedService = getRandomItem(services);
  const serviceDir = path.join(servicesDir, selectedService);

  console.log(`🎯 Target: ${selectedService}`);

  if (!fs.existsSync(serviceDir)) {
    console.error(`Service ${selectedService} does not exist!`);
    process.exit(1);
  }

  const bugTypes = Object.values(BUG_TYPES);
  const selectedBug = getRandomItem(bugTypes);

  console.log(`🐛 Bug Type: ${selectedBug}\n`);

  let result;
  switch (selectedBug) {
    case BUG_TYPES.SYNTAX_ERROR:
      result = injectSyntaxError(serviceDir);
      break;
    case BUG_TYPES.TYPE_MISMATCH:
      result = injectTypeMismatch(serviceDir);
      break;
    case BUG_TYPES.LOGIC_ERROR:
      result = injectLogicError(serviceDir);
      break;
    case BUG_TYPES.MISSING_DEPENDENCY:
      result = injectMissingDependency(serviceDir);
      break;
    case BUG_TYPES.CORRUPTED_JSON:
      result = injectCorruptedJson(serviceDir);
      break;
    default:
      result = 'Unknown bug type';
  }

  console.log(`✅ Result: ${result}`);

  // Log to incident-history
  const logPath = path.join(__dirname, '..', 'docs', 'incident-history.log');
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] CHAOS: ${selectedService} - ${selectedBug} - ${result}\n`;

  if (!fs.existsSync(path.dirname(logPath))) {
    fs.mkdirSync(path.dirname(logPath));
  }
  fs.appendFileSync(logPath, logEntry);

  console.log('\n📝 Incident logged to incident-history.log');

  // Update MCP state
  try {
    const stateUpdater = require('./update-state.js');
    stateUpdater.initializeState();
    stateUpdater.markServiceCritical(selectedService);
    console.log('✓ Dashboard state updated');
  } catch (e) {
    console.log('⚠ Could not update dashboard state:', e.message);
  }

  console.log('\n🚀 To check status, run: node scripts/check-status.js');
  console.log('🌐 Refresh dashboard to see the incident');
}

// Run if called directly
if (require.main === module) {
  runChaos();
}

module.exports = { runChaos, BUG_TYPES };