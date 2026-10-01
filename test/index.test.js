import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildIndex, search } from '../src/index.js';

test('indexes several documents and cites the right source', () => {
  const index = buildIndex([
    { id: 'a.md', text: '# Cache\nEvict entries after ten minutes.' },
    { id: 'b.md', text: '# Auth\nTokens expire after one hour.' },
  ]);
  const [top] = search(index, 'when do tokens expire');
  assert.equal(top.chunk.source, 'b.md');
  assert.deepEqual(top.chunk.headings, ['Auth']);
});
