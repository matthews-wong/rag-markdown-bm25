import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildIndex } from '../src/index.js';
import { evaluate } from '../src/evaluate.js';

const index = buildIndex([
  { id: 'a.md', text: '# One\nalpha beta\n# Two\ngamma delta' },
]);

test('scores a hit at rank 1 as 1 and a miss as 0', () => {
  const result = evaluate(index, [
    { query: 'alpha', expect: 'a.md#0' },
    { query: 'alpha', expect: 'a.md#1' },
  ], 3);
  assert.deepEqual(result, { n: 2, recall: 0.5, mrr: 0.5 });
});

test('golden set stays above a recall floor', () => {
  const path = 'fixtures/runbook.md';
  const golden = JSON.parse(readFileSync('fixtures/golden.json', 'utf8'));
  const idx = buildIndex([{ id: path, text: readFileSync(path, 'utf8') }]);
  assert.equal(evaluate(idx, golden, 3).recall, 1);
});
