import { chunkMarkdown } from './chunk.js';
import { buildBm25, searchBm25 } from './bm25.js';

/**
 * @param {{id: string, text: string}[]} documents markdown documents
 */
export function buildIndex(documents) {
  const chunks = documents.flatMap((doc) => chunkMarkdown(doc.id, doc.text));
  return buildBm25(chunks);
}

export { searchBm25 as search };
export { formatContext } from './context.js';
