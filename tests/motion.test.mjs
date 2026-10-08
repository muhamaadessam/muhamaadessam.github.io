import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pointerPosition } from '../src/lib/motion.ts';

test('pointer tilt centers, clamps outside bounds, and handles an unmeasured surface', () => {
  assert.equal(pointerPosition(100, 200), 0);
  assert.equal(pointerPosition(0, 200), -1);
  assert.equal(pointerPosition(200, 200), 1);
  assert.equal(pointerPosition(-40, 200), -1);
  assert.equal(pointerPosition(300, 200), 1);
  assert.equal(pointerPosition(10, 0), 0);
});
