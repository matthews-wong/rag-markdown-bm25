import { tokenize } from './tokenize.js';

// Standard Okapi defaults; k1 controls term-frequency saturation, b length normalisation.
const DEFAULT_K1 = 1.2;
const DEFAULT_B = 0.75;

/**
 * Builds a BM25 index over chunks. Heading text is indexed with the body so
 * a query that matches a title still finds the section.
 * @param {import('./chunk.js').Chunk[]} chunks
 * @param {{k1?: number, b?: number}} [options]
 */
export function buildBm25(chunks, { k1 = DEFAULT_K1, b = DEFAULT_B } = {}) {
  const docs = chunks.map((chunk) => {
    const terms = tokenize(`${chunk.headings.join(' ')} ${chunk.text}`);
    const freqs = new Map();
    for (const term of terms) freqs.set(term, (freqs.get(term) ?? 0) + 1);
    return { chunk, length: terms.length, freqs };
  });

  const docFreq = new Map();
  for (const { freqs } of docs) {
    for (const term of freqs.keys()) docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
  }
  const totalLength = docs.reduce((sum, d) => sum + d.length, 0);
  const avgLength = docs.length === 0 ? 0 : totalLength / docs.length;

  return { docs, docFreq, avgLength, k1, b };
}

/**
 * Scores every chunk against the query and returns matches, best first.
 * Chunks with a zero score are omitted. Ties keep corpus order.
 * @param {ReturnType<typeof buildBm25>} index
 * @param {string} query
 * @param {{k?: number}} [options]
 * @returns {{score: number, chunk: import('./chunk.js').Chunk}[]}
 */
export function searchBm25(index, query, { k = 5 } = {}) {
  const terms = [...new Set(tokenize(query))];
  const n = index.docs.length;
  const scored = [];

  for (const doc of index.docs) {
    let score = 0;
    for (const term of terms) {
      const tf = doc.freqs.get(term);
      if (!tf) continue;
      const df = index.docFreq.get(term);
      const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
      const norm = 1 - index.b + index.b * (doc.length / index.avgLength);
      score += (idf * tf * (index.k1 + 1)) / (tf + index.k1 * norm);
    }
    if (score > 0) scored.push({ score, chunk: doc.chunk });
  }
  // Array#sort is stable, so equal scores stay in corpus order.
  return scored.sort((a, b) => b.score - a.score).slice(0, k);
}
