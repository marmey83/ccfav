// src/commands/pick.ts
import { getClaudeProjectsDir, getCcfavDbPath } from '../lib/config.js';
import { findCurrentTranscript, loadTranscriptResponses } from '../lib/transcript.js';
import { createDb, saveFavourite } from '../lib/db.js';
import { makePreview, truncate, green, bold, dim, cyan } from '../lib/format.js';
import { AssistantResponse } from '../types/index.js';

interface PickOptions {
  tag?: string[];
  note?: string;
}

export async function pickCommand(num: string | undefined, opts: PickOptions): Promise<void> {
  const cwd = process.cwd();
  const transcriptPath = findCurrentTranscript(cwd, getClaudeProjectsDir());

  if (!transcriptPath) {
    console.error(`No Claude Code transcript found for ${cwd}`);
    process.exit(1);
  }

  const responses = loadTranscriptResponses(transcriptPath);

  if (responses.length === 0) {
    console.error('No assistant responses found in current transcript');
    process.exit(1);
  }

  // Show last 10, most recent first
  const recent = responses.slice(-10).reverse();

  // No number given — print the list and hint
  if (num === undefined) {
    recent.forEach((r: AssistantResponse, i: number) => {
      console.log(`  ${bold(String(i + 1).padStart(2, ' '))}. ${truncate(r.text.split('\n')[0] ?? '', 70)}`);
    });
    console.log('');
    console.log(dim(`Run: fav pick <number>  (e.g. fav pick 3)`));
    return;
  }

  const n = parseInt(num, 10);
  if (isNaN(n) || n < 1 || n > recent.length) {
    console.error(`Invalid selection — enter a number between 1 and ${recent.length}`);
    process.exit(1);
  }

  const chosen = recent[n - 1] as AssistantResponse;
  const tags = opts.tag ?? [];

  const db = createDb(getCcfavDbPath());
  const id = saveFavourite(db, {
    content: chosen.text,
    preview: makePreview(chosen.text),
    project_path: cwd,
    transcript_file: chosen.transcriptPath,
    original_timestamp: chosen.timestamp,
    notes: opts.note ?? null,
  }, tags);

  const tagStr = tags.length > 0 ? ` ${cyan(`[${tags.join(', ')}]`)}` : '';
  const projectName = cwd.split('/').pop() ?? cwd;
  console.log(`${green('★')} saved ${bold(`#${id}`)} ${dim(`(${projectName})`)}${tagStr}`);
}
