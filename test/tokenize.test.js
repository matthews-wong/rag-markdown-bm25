import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenize } from '../src/tokenize.js';

test('lower-cases and splits on punctuation', () => {
  assert.deepEqual(tokenize('Roll-back: v2.1!'), ['roll', 'back', 'v2', '1']);
});

test('drops stopwords', () => {
  assert.deepEqual(tokenize('the state of the art'), ['state', 'art']);
});

test('keeps non-ascii letters', () => {
  assert.deepEqual(tokenize('Café déploiement'), ['café', 'déploiement']);
});

test('returns an empty list for empty input', () => {
  assert.deepEqual(tokenize(''), []);
  assert.deepEqual(tokenize('!!! ---'), []);
});
