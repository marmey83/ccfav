// src/commands/save.ts
import { getClaudeProjectsDir, getCcfavDbPath } from '../lib/config.js';
import { findCurrentTranscript, loadTranscriptResponses } from '../lib/transcript.js';
import { createDb, saveFavourite } from '../lib/db.js';
import { makePreview, bold, green, dim, cyan } from '../lib/format.js';
import { SaveOptions } from '../types/index.js';

export async function saveCommand(position: string, options: SaveOptions): Promise<void> {
  const pos = parseInt(position, 10);
  if (isNaN(pos) || pos < 1) {
    console.error('Position must be a positive number');
    process.exit(1);
  }

  const cwd = process.cwd();
  const claudeDir = getClaudeProjectsDir();
  const transcriptPath = findCurrentTranscript(cwd, claudeDir);

  if (!transcriptPath) {
    console.error(`No Claude Code transcript found for ${cwd}`);
    console.error(`Expected: ${claudeDir}/<project-slug>/*.jsonl`);
    process.exit(1);
  }

  const responses = loadTranscriptResponses(transcriptPath);

  if (responses.length === 0) {
    console.error('No assistant responses found in current transcript');
    process.exit(1);
  }

  if (pos > responses.length) {
    console.error(`Only ${responses.length} response(s) available (requested position ${pos})`);
    process.exit(1);
  }

  const response = responses[responses.length - pos];
  const tags = options.tags ?? [];

  const db = createDb(getCcfavDbPath());
  const id = saveFavourite(db, {
    content: response.text,
    preview: makePreview(response.text),
    project_path: cwd,
    transcript_file: response.transcriptPath,
    original_timestamp: response.timestamp,
    notes: options.note ?? null,
  }, tags);

  const projectName = cwd.split('/').pop() ?? cwd;
  const tagStr = tags.length > 0 ? ` ${cyan(`[${tags.join(', ')}]`)}` : '';
  console.log(`${green('★')} saved ${bold(`#${id}`)} ${dim(`(${projectName})`)}${tagStr}`);
  console.log('');
  console.log(dim(response.text.split('\n').slice(0, 5).join('\n')));
  if (response.text.split('\n').length > 5) console.log(dim(`… (fav show ${id} for full content)`));
}
