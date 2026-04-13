// src/commands/show.ts
import { getCcfavDbPath } from '../lib/config.js';
import { createDb, getFavouriteById } from '../lib/db.js';
import { formatFavDetail } from '../lib/format.js';

export async function showCommand(id: string): Promise<void> {
  const db = createDb(getCcfavDbPath());
  const fav = getFavouriteById(db, parseInt(id, 10));

  if (!fav) {
    console.error(`Favourite #${id} not found`);
    process.exit(1);
  }

  console.log(formatFavDetail(fav));
}
