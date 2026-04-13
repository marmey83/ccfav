// src/commands/search.ts
import { getCcfavDbPath } from '../lib/config.js';
import { createDb, searchFavourites } from '../lib/db.js';
import { formatFavRow, pluralize, bold, dim } from '../lib/format.js';

interface SearchOptions {
  tag?: string;
}

export async function searchCommand(query: string, options: SearchOptions): Promise<void> {
  if (!query.trim()) {
    console.error('Please provide a search query');
    process.exit(1);
  }

  const db = createDb(getCcfavDbPath());
  const results = searchFavourites(db, query, { tag: options.tag });

  if (results.length === 0) {
    console.log(dim(`No results for "${query}"`));
    return;
  }

  console.log(bold(`Results for "${query}":`));
  for (const fav of results) {
    console.log(formatFavRow(fav));
  }
  console.log(dim(`\n${pluralize(results.length, 'result')}`));
}
