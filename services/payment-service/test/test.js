/**
 * Regression Tests for payment-service
 */

const assert = require('assert');

console.log('\n🧪 Running regression tests...\n');

// Test 1: Verify express dependency
try {
  const express = require('express');
  assert(express !== undefined, 'Express should be available');
  console.log('✓ express dependency available');
} catch (err) {
  console.error('✗ express dependency missing');
  process.exit(1);
}

// Test 2: Verify cors dependency
try {
  const cors = require('cors');
  assert(cors !== undefined, 'CORS should be available');
  console.log('✓ cors dependency available');
} catch (err) {
  console.error('✗ cors dependency missing');
  process.exit(1);
}

// Test 3: Verify package.json
const pkg = require('../package.json');
assert(pkg.dependencies.express !== undefined, 'Express should be in package.json');
assert(pkg.dependencies.cors !== undefined, 'CORS should be in package.json');
console.log('✓ package.json has required dependencies');

console.log('\n✅ All tests passed!\n');
process.exit(0);