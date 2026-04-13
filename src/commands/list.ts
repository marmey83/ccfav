// src/commands/list.ts
import { getCcfavDbPath } from '../lib/config.js';
import { createDb, getFavourites } from '../lib/db.js';
import { formatFavRow, pluralize, dim } from '../lib/format.js';

interface ListOptions {
  tag?: string;
  project?: string;
  limit?: string;
}

export async function listCommand(options: ListOptions): Promise<void> {
  const db = createDb(getCcfavDbPath());
  const limit = options.limit ? parseInt(options.limit, 10) : undefined;
  const favourites = getFavourites(db, {
    tag: options.tag,
    project: options.project,
    limit,
  });

  if (favourites.length === 0) {
    console.log(dim('No favourites yet. Run `fav` to save a response.'));
    return;
  }

  for (const fav of favourites) {
    console.log(formatFavRow(fav));
  }
  console.log(dim(`\n${pluralize(favourites.length, 'favourite')}`));
}
