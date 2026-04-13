// src/commands/pick.ts
import { getClaudeProjectsDir, getCcfavDbPath } from '../lib/config.js';
import { findCurrentTranscript, loadTranscriptResponses } from '../lib/transcript.js';
import { createDb, saveFavourite } from '../lib/db.js';
import { makePreview, truncate, green, bold, dim } from '../lib/format.js';
import { input } from '@inquirer/prompts';
import { AssistantResponse } from '../types/index.js';

export async function pickCommand(): Promise<void> {
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

  recent.forEach((r: AssistantResponse, i: number) => {
    console.log(`  ${bold(String(i + 1).padStart(2, ' '))}. ${truncate(r.text.split('\n')[0] ?? '', 70)}`);
  });
  console.log('');

  const numInput = await input({ message: 'Enter number to save:' });
  const num = parseInt(numInput.trim(), 10);

  if (isNaN(num) || num < 1 || num > recent.length) {
    console.error(`Invalid selection — enter a number between 1 and ${recent.length}`);
    process.exit(1);
  }

  const chosen = recent[num - 1] as AssistantResponse;

  const tagInput = await input({
    message: 'Tags (comma-separated, or Enter to skip):',
  });

  const tags = tagInput.trim()
    ? tagInput.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const db = createDb(getCcfavDbPath());
  const id = saveFavourite(db, {
    content: chosen.text,
    preview: makePreview(chosen.text),
    project_path: cwd,
    transcript_file: chosen.transcriptPath,
    original_timestamp: chosen.timestamp,
    notes: null,
  }, tags);

  const tagStr = tags.length > 0 ? ` [${tags.join(', ')}]` : '';
  const projectName = cwd.split('/').pop() ?? cwd;
  console.log(`${green('★')} saved ${bold(`#${id}`)} ${dim(`(${projectName})`)}${tagStr}`);
}
