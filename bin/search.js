#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { buildIndex, search, formatContext } from '../src/index.js';

const USAGE = 'usage: search.js <query> <file.md>... [--k N] [--context]';

function parseArgs(argv) {
  const positional = [];
  let k = 3;
  let context = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--context') context = true;
    else if (argv[i] === '--k') k = Number(argv[++i]);
    else positional.push(argv[i]);
  }
  if (positional.length < 2 || !Number.isInteger(k) || k < 1) {
    throw new Error(USAGE);
  }
  const [query, ...files] = positional;
  return { query, files, k, context };
}

try {
  const { query, files, k, context } = parseArgs(process.argv.slice(2));
  const index = buildIndex(files.map((id) => ({ id, text: readFileSync(id, 'utf8') })));
  const hits = search(index, query, { k });
  if (context) {
    console.log(formatContext(hits));
  } else {
    for (const { score, chunk } of hits) {
      console.log(`${score.toFixed(3)}  ${[chunk.source, ...chunk.headings].join(' > ')}`);
    }
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
