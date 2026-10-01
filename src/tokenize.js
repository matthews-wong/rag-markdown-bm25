const TOKEN_PATTERN = /[\p{L}\p{N}]+/gu;

// Words that carry no retrieval signal; kept short so rare terms stay rare.
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'in',
  'is', 'it', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'with',
]);

/**
 * Lower-cases text and splits it into alphanumeric terms, dropping stopwords.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  const tokens = text.toLowerCase().match(TOKEN_PATTERN) ?? [];
  return tokens.filter((token) => !STOPWORDS.has(token));
}
