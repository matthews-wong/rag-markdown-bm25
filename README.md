# rag-markdown-bm25

A small, dependency-free retrieval library for markdown notes. It splits
documents on headings, indexes the chunks with BM25, and returns ranked
results that carry a citation (file + heading path) so an answer can point
back to where it came from.

Everything runs offline on Node 22. There is no model, no embedding step and
no server.

## Usage

```js
import { buildIndex, search } from './src/index.js';

const index = buildIndex([{ id: 'docs/deploy.md', text: markdownString }]);
const hits = search(index, 'rollback a failed deploy', { k: 3 });
// [{ score, chunk: { id, source, headings, text } }, ...]
```

## Layout

- `src/` – tokenizer, chunker, BM25 index
- `test/` – `node --test` suites
- `fixtures/` – small corpus used by tests and the eval

## Tests

```sh
npm test
```
