import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunkMarkdown } from '../src/chunk.js';

const DOC = `intro line

# Deploy
Run the pipeline.

## Rollback
Redeploy the previous tag.

# Monitoring
Watch the dashboards.
`;

test('splits on headings and tracks the heading path', () => {
  const chunks = chunkMarkdown('ops.md', DOC);
  assert.deepEqual(chunks.map((c) => c.headings), [
    [],
    ['Deploy'],
    ['Deploy', 'Rollback'],
    ['Monitoring'],
  ]);
  assert.equal(chunks[2].text, 'Redeploy the previous tag.');
});

test('chunk ids are stable and carry the source', () => {
  const ids = chunkMarkdown('ops.md', DOC).map((c) => c.id);
  assert.deepEqual(ids, ['ops.md#0', 'ops.md#1', 'ops.md#2', 'ops.md#3']);
});

test('ignores headings inside fenced code blocks', () => {
  const chunks = chunkMarkdown('a.md', '# Setup\n```sh\n# not a heading\nls\n```\n');
  assert.equal(chunks.length, 1);
  assert.match(chunks[0].text, /not a heading/);
});

test('drops sections without body text', () => {
  const chunks = chunkMarkdown('a.md', '# Empty\n\n# Full\ntext\n');
  assert.deepEqual(chunks.map((c) => c.headings), [['Full']]);
});

test('handles CRLF line endings and trailing hashes', () => {
  const chunks = chunkMarkdown('a.md', '## Title ##\r\nbody\r\n');
  assert.deepEqual(chunks[0].headings, ['Title']);
});

test('returns no chunks for empty input', () => {
  assert.deepEqual(chunkMarkdown('a.md', ''), []);
});
