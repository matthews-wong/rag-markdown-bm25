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

## Prompt context

`formatContext(hits)` renders results as numbered `<source>` blocks, each with
a `cite` label. Retrieved text is treated as untrusted data: closing tags
inside a chunk are neutralised so it cannot escape its block, and the
preamble tells the model not to follow instructions found in sources.

## CLI

```sh
node bin/search.js "how do I roll back" fixtures/runbook.md --k 2
node bin/search.js "how do I roll back" fixtures/runbook.md --context
```

## Evaluation

```sh
npm run eval
```

Reports recall@3 and MRR for the golden queries in `fixtures/golden.json`.
The set is five hand-written queries over a four-section runbook, so the
numbers are a regression check on a fixture, not a general benchmark.

## Design notes

- Chunks split on headings, and headings inside code fences are ignored.
  Heading text is indexed with the body so titles are searchable.
- No stemming: `deploy` does not match `redeploy`. Simple and predictable;
  a stemmer is the obvious next step if recall on real notes needs it.

## Tests

```sh
npm test
```
