import { search } from './index.js';

/**
 * Recall@k and MRR of a golden set, where each case names the one chunk id
 * that should be retrieved.
 * @param {ReturnType<typeof import('./index.js').buildIndex>} index
 * @param {{query: string, expect: string}[]} cases
 * @param {number} k
 */
export function evaluate(index, cases, k) {
  let found = 0;
  let reciprocalRanks = 0;
  for (const { query, expect } of cases) {
    const ids = search(index, query, { k }).map((h) => h.chunk.id);
    const rank = ids.indexOf(expect);
    if (rank === -1) continue;
    found += 1;
    reciprocalRanks += 1 / (rank + 1);
  }
  return { n: cases.length, recall: found / cases.length, mrr: reciprocalRanks / cases.length };
}
