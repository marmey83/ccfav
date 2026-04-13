// src/commands/delete.ts
import { getCcfavDbPath } from '../lib/config.js';
import { createDb, getFavouriteById, deleteFavourite } from '../lib/db.js';
import { dim, bold } from '../lib/format.js';
import { confirm } from '@inquirer/prompts';

interface DeleteOptions {
  force?: boolean;
}

export async function deleteCommand(id: string, options: DeleteOptions): Promise<void> {
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    console.error(`Invalid ID: "${id}" — must be a number`);
    process.exit(1);
  }
  const db = createDb(getCcfavDbPath());
  const fav = getFavouriteById(db, numId);

  if (!fav) {
    console.error(`Favourite #${id} not found`);
    process.exit(1);
  }

  if (!options.force) {
    const preview = fav.preview.slice(0, 60);
    const ok = await confirm({
      message: `Delete #${numId} "${preview}"?`,
      default: false,
    });
    if (!ok) {
      console.log(dim('Cancelled.'));
      return;
    }
  }

  deleteFavourite(db, numId);
  console.log(`Deleted ${bold(`#${numId}`)}`);
}
