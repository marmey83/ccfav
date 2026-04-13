// src/lib/config.ts
import { homedir } from 'os';
import path from 'path';

export function getClaudeProjectsDir(): string {
  const configDir = process.env.CLAUDE_CONFIG_DIR;
  if (configDir) return path.join(configDir, 'projects');
  return path.join(homedir(), '.claude', 'projects');
}

export function getCcfavDir(): string {
  return path.join(homedir(), '.ccfav');
}

export function getCcfavDbPath(): string {
  return path.join(getCcfavDir(), 'ccfav.db');
}

export function projectPathToSlug(projectPath: string): string {
  // Strip git worktree suffix (.worktrees/<branch>) so we resolve to the main project
  const worktreeMatch = projectPath.match(/^(.*?)\/.worktrees\/.+$/);
  const resolved = worktreeMatch ? worktreeMatch[1] : projectPath;
  return resolved.replace(/[/.]/g, '-');
}
