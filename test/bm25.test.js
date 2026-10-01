import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBm25, searchBm25 } from '../src/bm25.js';

const chunk = (id, headings, text) => ({ id, source: 's.md', headings, text });
const CHUNKS = [
  chunk('s.md#0', ['Deploy'], 'Run the pipeline to ship a release.'),
  chunk('s.md#1', ['Rollback'], 'Redeploy the previous release tag after a failed release.'),
  chunk('s.md#2', ['Backups'], 'Nightly snapshots are kept for thirty days.'),
];

test('ranks the section that matches the query first', () => {
  const hits = searchBm25(buildBm25(CHUNKS), 'nightly snapshots');
  assert.equal(hits[0].chunk.id, 's.md#2');
});

test('rarer terms outweigh common ones', () => {
  const hits = searchBm25(buildBm25(CHUNKS), 'release rollback');
  assert.equal(hits[0].chunk.id, 's.md#1');
});

test('matches on heading text', () => {
  const hits = searchBm25(buildBm25(CHUNKS), 'backups');
  assert.equal(hits[0].chunk.id, 's.md#2');
});

test('omits chunks with no matching terms', () => {
  const hits = searchBm25(buildBm25(CHUNKS), 'snapshots');
  assert.deepEqual(hits.map((h) => h.chunk.id), ['s.md#2']);
});

test('respects k', () => {
  assert.equal(searchBm25(buildBm25(CHUNKS), 'release', { k: 1 }).length, 1);
});

test('empty query and empty corpus return nothing', () => {
  assert.deepEqual(searchBm25(buildBm25(CHUNKS), ''), []);
  assert.deepEqual(searchBm25(buildBm25([]), 'anything'), []);
});
