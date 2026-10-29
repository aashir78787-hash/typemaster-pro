import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNetWpm,
  calculateGrossWpm,
  calculateAccuracy,
  calculateCpm,
  calculateStars,
  getFingerForKey,
  generateWeakKeyDrill
} from './typingMath';

test('calculateNetWpm calculates correctly for standard 5 chars per word', () => {
  // 300 correct characters in 60 seconds = 60 words in 1 minute = 60 WPM
  assert.equal(calculateNetWpm(300, 60), 60);
  // 150 correct characters in 30 seconds = 30 words in 0.5 minute = 60 WPM
  assert.equal(calculateNetWpm(150, 30), 60);
  // 0 seconds should return 0
  assert.equal(calculateNetWpm(100, 0), 0);
});

test('calculateGrossWpm includes all characters', () => {
  // 350 total characters in 60 seconds = 70 Gross WPM
  assert.equal(calculateGrossWpm(350, 60), 70);
});

test('calculateAccuracy calculates percentage bounded 0-100', () => {
  assert.equal(calculateAccuracy(95, 100), 95);
  assert.equal(calculateAccuracy(100, 100), 100);
  assert.equal(calculateAccuracy(0, 0), 100);
  assert.equal(calculateAccuracy(48, 50), 96);
});

test('calculateCpm calculates characters per minute', () => {
  assert.equal(calculateCpm(250, 60), 250);
  assert.equal(calculateCpm(125, 30), 250);
});

test('calculateStars awards correct star tiers based on target', () => {
  // target: 40 wpm, 95% acc
  // Below targets -> 0 stars
  assert.equal(calculateStars(25, 90, 40, 95), 0);
  // Passed targets -> 2 stars
  assert.equal(calculateStars(42, 96, 40, 95), 2);
  // Outstanding (>125% wpm and high acc) -> 3 stars
  assert.equal(calculateStars(55, 98, 40, 95), 3);
  // Just minimum speed/acc
  assert.equal(calculateStars(35, 95, 40, 95), 1);
});

test('getFingerForKey maps fingers correctly', () => {
  assert.equal(getFingerForKey('f').finger, 'left-index');
  assert.equal(getFingerForKey('j').finger, 'right-index');
  assert.equal(getFingerForKey('a').finger, 'left-pinky');
  assert.equal(getFingerForKey(';').finger, 'right-pinky');
  assert.equal(getFingerForKey(' ').finger, 'thumb');
  assert.equal(getFingerForKey('k').finger, 'right-middle');
  assert.equal(getFingerForKey('s').finger, 'left-ring');
});

test('generateWeakKeyDrill generates drill containing weak keys', () => {
  const drill = generateWeakKeyDrill(['z', 'q'], 10);
  assert.ok(drill.length > 10);
  assert.ok(drill.toLowerCase().includes('z') || drill.toLowerCase().includes('q'));
});
