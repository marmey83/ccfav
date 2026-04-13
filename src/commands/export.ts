// src/commands/export.ts
import { getCcfavDbPath } from '../lib/config.js';
import { createDb, getFavourites } from '../lib/db.js';
import { formatDate } from '../lib/format.js';
import { writeFileSync } from 'fs';
import { Favourite } from '../types/index.js';

interface ExportOptions {
  tag?: string;
  project?: string;
  output?: string;
}

function toMarkdown(favourites: Favourite[]): string {
  const lines: string[] = ['# ccfav Export\n'];

  for (const fav of favourites) {
    lines.push(`## #${fav.id} — ${fav.preview}`);
    if (fav.tags.length > 0) lines.push(`**Tags:** ${fav.tags.join(', ')}`);
    if (fav.project_path) lines.push(`**Project:** ${fav.project_path}`);
    lines.push(`**Saved:** ${formatDate(fav.created_at)}`);
    if (fav.notes) lines.push(`**Note:** ${fav.notes}`);
    lines.push('');
    lines.push(fav.content);
    lines.push('\n---\n');
  }

  return lines.join('\n');
}

export async function exportCommand(options: ExportOptions): Promise<void> {
  const db = createDb(getCcfavDbPath());
  const favourites = getFavourites(db, {
    tag: options.tag,
    project: options.project,
  });

  if (favourites.length === 0) {
    console.error('No favourites to export');
    process.exit(1);
  }

  const markdown = toMarkdown(favourites);

  if (options.output) {
    try {
      writeFileSync(options.output, markdown, 'utf-8');
      console.log(`Exported ${favourites.length} favourite(s) to ${options.output}`);
    } catch (err) {
      console.error(`Failed to write to ${options.output}: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(markdown);
  }
}
