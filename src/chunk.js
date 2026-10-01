const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE_PATTERN = /^\s*(```|~~~)/;

/**
 * @typedef {object} Chunk
 * @property {string} id        `<source>#<n>`, stable for a given document
 * @property {string} source    document id the chunk came from
 * @property {string[]} headings heading path, outermost first
 * @property {string} text      body text without the heading lines
 */

/**
 * Splits markdown into one chunk per heading section. Headings inside fenced
 * code blocks are ignored so shell comments (`# like this`) do not split.
 * Sections with no body text are dropped.
 * @param {string} source
 * @param {string} markdown
 * @returns {Chunk[]}
 */
export function chunkMarkdown(source, markdown) {
  const chunks = [];
  let path = [];
  let body = [];
  let inFence = false;

  const flush = () => {
    const text = body.join('\n').trim();
    body = [];
    if (text === '') return;
    chunks.push({ id: `${source}#${chunks.length}`, source, headings: [...path], text });
  };

  for (const line of markdown.split(/\r?\n/)) {
    if (FENCE_PATTERN.test(line)) inFence = !inFence;
    const match = inFence ? null : HEADING_PATTERN.exec(line);
    if (!match) {
      body.push(line);
      continue;
    }
    flush();
    const depth = match[1].length;
    path = [...path.slice(0, depth - 1), match[2]];
  }
  flush();
  return chunks;
}
