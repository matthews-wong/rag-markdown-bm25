import { readFileSync } from 'node:fs';
import { buildIndex } from '../src/index.js';
import { evaluate } from '../src/evaluate.js';

const CORPUS = 'fixtures/runbook.md';
const GOLDEN = 'fixtures/golden.json';
const K = 3;

const index = buildIndex([{ id: CORPUS, text: readFileSync(CORPUS, 'utf8') }]);
const cases = JSON.parse(readFileSync(GOLDEN, 'utf8'));
const { n, recall, mrr } = evaluate(index, cases, K);
console.log(`fixture: ${GOLDEN} (${n} queries over ${index.docs.length} chunks)`);
console.log(`recall@${K}: ${recall.toFixed(2)}  MRR: ${mrr.toFixed(2)}`);
