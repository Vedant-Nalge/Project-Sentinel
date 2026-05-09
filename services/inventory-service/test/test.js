const assert = require('assert');

// Test 1: Verify express dependency is available
try {
  const express = require('express');
  assert(express !== undefined, 'Express should be available');
  console.log('PASS: express dependency available');
} catch (err) {
  console.error('FAIL: express dependency missing -', err.message);
  process.exit(1);
}

// Test 2: Verify cors dependency is available
try {
  const cors = require('cors');
  assert(cors !== undefined, 'CORS should be available');
  console.log('PASS: cors dependency available');
} catch (err) {
  console.error('FAIL: cors dependency missing -', err.message);
  process.exit(1);
}

// Test 3: Verify package.json has correct dependencies
const pkg = require('../package.json');
assert(pkg.dependencies.express !== undefined, 'Express should be in package.json');
assert(pkg.dependencies.cors !== undefined, 'CORS should be in package.json');
console.log('PASS: package.json has required dependencies');

console.log('\nAll regression tests passed!');