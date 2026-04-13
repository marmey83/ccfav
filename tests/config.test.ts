// tests/config.test.ts
import { describe, it, expect } from 'vitest';
import { getClaudeProjectsDir, getCcfavDir, projectPathToSlug } from '../src/lib/config.js';
import { homedir } from 'os';
import path from 'path';

describe('config', () => {
  it('returns default claude projects dir', () => {
    delete process.env.CLAUDE_CONFIG_DIR;
    expect(getClaudeProjectsDir()).toBe(path.join(homedir(), '.claude', 'projects'));
  });

  it('respects CLAUDE_CONFIG_DIR env var', () => {
    process.env.CLAUDE_CONFIG_DIR = '/custom/claude';
    expect(getClaudeProjectsDir()).toBe('/custom/claude/projects');
    delete process.env.CLAUDE_CONFIG_DIR;
  });

  it('returns ccfav dir in home', () => {
    expect(getCcfavDir()).toBe(path.join(homedir(), '.ccfav'));
  });

  it('converts project path to slug', () => {
    expect(projectPathToSlug('/Users/martina/Projects/nourli')).toBe('-Users-martina-Projects-nourli');
    expect(projectPathToSlug('/home/user/my-project')).toBe('-home-user-my-project');
    // dots in username or directory names are also replaced (matches Claude Code's behaviour)
    expect(projectPathToSlug('/Users/martina.meyer/Projects/nourli')).toBe('-Users-martina-meyer-Projects-nourli');
  });
});
