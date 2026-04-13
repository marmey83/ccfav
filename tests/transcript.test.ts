// tests/transcript.test.ts
import { describe, it, expect } from 'vitest';
import { extractTextFromContent, parseAssistantResponses, findCurrentTranscript } from '../src/lib/transcript.js';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import path from 'path';
import os from 'os';

describe('extractTextFromContent', () => {
  it('returns empty string for no text blocks', () => {
    expect(extractTextFromContent([{ type: 'thinking', thinking: 'hmm' }])).toBe('');
  });

  it('extracts text from single text block', () => {
    expect(extractTextFromContent([{ type: 'text', text: 'Hello world' }])).toBe('Hello world');
  });

  it('joins multiple text blocks with newline', () => {
    expect(extractTextFromContent([
      { type: 'text', text: 'First' },
      { type: 'thinking', thinking: 'skip me' },
      { type: 'text', text: 'Second' },
    ])).toBe('First\nSecond');
  });

  it('ignores tool_use blocks', () => {
    expect(extractTextFromContent([
      { type: 'tool_use', text: undefined },
      { type: 'text', text: 'After tool' },
    ])).toBe('After tool');
  });
});

describe('parseAssistantResponses', () => {
  it('extracts assistant responses from JSONL content', () => {
    const lines = [
      JSON.stringify({ type: 'user', message: { role: 'user', content: [{ type: 'text', text: 'hi' }] }, timestamp: '2026-01-01T00:00:00Z', uuid: 'u1', sessionId: 'sess1' }),
      JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'hmm' }, { type: 'text', text: 'Hello there' }] }, timestamp: '2026-01-01T00:01:00Z', uuid: 'a1', sessionId: 'sess1' }),
      JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'thinking', thinking: 'only thinking' }] }, timestamp: '2026-01-01T00:02:00Z', uuid: 'a2', sessionId: 'sess1' }),
      JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: 'Second response' }] }, timestamp: '2026-01-01T00:03:00Z', uuid: 'a3', sessionId: 'sess1' }),
    ].join('\n');

    const responses = parseAssistantResponses(lines, '/fake/transcript.jsonl');
    expect(responses).toHaveLength(2);
    expect(responses[0].text).toBe('Hello there');
    expect(responses[0].uuid).toBe('a1');
    expect(responses[1].text).toBe('Second response');
  });

  it('skips malformed JSON lines', () => {
    const lines = [
      'not-json',
      JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: 'Good' }] }, timestamp: '2026-01-01T00:01:00Z', uuid: 'a1', sessionId: 's1' }),
    ].join('\n');
    const responses = parseAssistantResponses(lines, '/fake/transcript.jsonl');
    expect(responses).toHaveLength(1);
  });
});

describe('findCurrentTranscript', () => {
  it('returns null when no project dir exists', () => {
    const result = findCurrentTranscript('/nonexistent/path', '/nonexistent/projects');
    expect(result).toBeNull();
  });

  it('returns most recently modified jsonl file for current project', () => {
    const tmpDir = path.join(os.tmpdir(), 'ccfav-test-' + Date.now());
    const projectSlug = '-tmp-test-project';
    const projectDir = path.join(tmpDir, projectSlug);
    mkdirSync(projectDir, { recursive: true });

    const file1 = path.join(projectDir, 'session1.jsonl');
    const file2 = path.join(projectDir, 'session2.jsonl');
    writeFileSync(file1, '{"type":"user"}\n');
    // Small delay to ensure different mtime
    writeFileSync(file2, '{"type":"assistant"}\n');

    const result = findCurrentTranscript('/tmp/test-project', tmpDir);
    expect(result).toBe(file2);

    rmSync(tmpDir, { recursive: true });
  });
});
