const assert = require('assert');
const http = require('http');

// Load calculator engine logic
const { countNumericDigits, shouldTriggerHorror, calculateExpression } = require('./src/utils/calculatorEngine.js');

console.log('--- Testing CuteCalc Logic & Requirements ---');

// 1. Test digit counter and horror triggers
assert.strictEqual(countNumericDigits('123'), 3, '123 should have 3 digits');
assert.strictEqual(shouldTriggerHorror('123'), true, '123 must trigger horror');

assert.strictEqual(countNumericDigits('456 + 1'), 4, '456 + 1 should have 4 digits');
assert.strictEqual(shouldTriggerHorror('456 + 1'), true, '456 + 1 must trigger horror');

assert.strictEqual(countNumericDigits('999 × 999'), 6, '999 x 999 should have 6 digits');
assert.strictEqual(shouldTriggerHorror('999 × 999'), true, '999 x 999 must trigger horror');

assert.strictEqual(countNumericDigits('7 + 8'), 2, '7 + 8 has 2 digits');
assert.strictEqual(shouldTriggerHorror('7 + 8'), false, '7 + 8 must NOT trigger horror');

assert.strictEqual(countNumericDigits('12.5'), 3, '12.5 has 3 digits');
assert.strictEqual(shouldTriggerHorror('12.5'), true, '12.5 must trigger horror');

console.log('✓ All 3-digit horror trigger tests PASSED');

// 2. Test safe arithmetic calculations (without eval)
const testCalc1 = calculateExpression('7 + 8');
assert.strictEqual(testCalc1.success, true);
assert.strictEqual(testCalc1.result, '15');

const testCalc2 = calculateExpression('50 - 18');
assert.strictEqual(testCalc2.success, true);
assert.strictEqual(testCalc2.result, '32');

const testCalc3 = calculateExpression('6 × 7');
assert.strictEqual(testCalc3.success, true);
assert.strictEqual(testCalc3.result, '42');

const testCalc4 = calculateExpression('100 ÷ 4');
assert.strictEqual(testCalc4.success, true);
assert.strictEqual(testCalc4.result, '25');

const testCalc5 = calculateExpression('2 + 3 × 4');
assert.strictEqual(testCalc5.success, true);
assert.strictEqual(testCalc5.result, '14', 'Order of operations must prioritize multiplication');

const testCalc6 = calculateExpression('10 ÷ 0');
assert.strictEqual(testCalc6.success, false);
assert.strictEqual(testCalc6.error, 'Cannot divide by cute 0 🌸');

console.log('✓ All safe arithmetic calculation tests PASSED');

// 3. Test HTTP endpoints
function checkUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, length: data.length });
      });
    }).on('error', reject);
  });
}

async function testEndpoints() {
  const pages = [
    '/',
    '/dist/bundle.js',
    '/src/styles/app.css',
    '/assets/cute_calc_mascot.jpg',
    '/assets/spooky_ghost_face.jpg'
  ];

  for (const page of pages) {
    const res = await checkUrl(page);
    assert.strictEqual(res.statusCode, 200, `Failed to load ${page}`);
    assert.ok(res.length > 0, `Empty content for ${page}`);
    console.log(`✓ Endpoint ${page} returned 200 OK (${res.length} bytes)`);
  }

  console.log('\n ALL TESTS PASSED SUCCESSFULLY! CuteCalc is 100% operational!');
}

testEndpoints().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
