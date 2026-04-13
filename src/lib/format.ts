// src/lib/format.ts
import { Favourite } from '../types/index.js';

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

export function makePreview(content: string, maxLen = 100): string {
  const firstLine = content.split('\n')[0] ?? '';
  return truncate(firstLine, maxLen);
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return isoString;
  }
}

export function pluralize(count: number, word: string): string {
  return `${count} ${count === 1 ? word : word + 's'}`;
}

// ANSI color helpers (minimal, no external dep needed)
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';

export function dim(s: string): string { return `${DIM}${s}${RESET}`; }
export function bold(s: string): string { return `${BOLD}${s}${RESET}`; }
export function cyan(s: string): string { return `${CYAN}${s}${RESET}`; }
export function green(s: string): string { return `${GREEN}${s}${RESET}`; }
export function yellow(s: string): string { return `${YELLOW}${s}${RESET}`; }

export function formatFavRow(fav: Favourite): string {
  const id = bold(`#${fav.id}`);
  const preview = truncate(fav.preview, 60);
  const tags = fav.tags.length > 0 ? cyan(`[${fav.tags.join(', ')}]`) : '';
  const date = dim(fav.created_at.slice(0, 10));
  return `${id}  ${preview}  ${tags}  ${date}`;
}

export function formatFavDetail(fav: Favourite): string {
  const lines: string[] = [];
  lines.push(bold(`Favourite #${fav.id}`));
  if (fav.tags.length > 0) lines.push(cyan(`Tags: ${fav.tags.join(', ')}`));
  if (fav.project_path) lines.push(dim(`Project: ${fav.project_path}`));
  if (fav.original_timestamp) lines.push(dim(`Original: ${formatDate(fav.original_timestamp)}`));
  lines.push(dim(`Saved: ${formatDate(fav.created_at)}`));
  if (fav.notes) lines.push(yellow(`Note: ${fav.notes}`));
  lines.push('');
  lines.push(fav.content);
  return lines.join('\n');
}
