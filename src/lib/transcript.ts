// src/lib/transcript.ts
import { readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { TranscriptEntry, ContentBlock, AssistantResponse } from '../types/index.js';
import { projectPathToSlug } from './config.js';

export function extractTextFromContent(content: ContentBlock[]): string {
  return content
    .filter(block => block.type === 'text' && typeof block.text === 'string')
    .map(block => block.text as string)
    .join('\n');
}

export function parseAssistantResponses(jsonlContent: string, transcriptPath: string): AssistantResponse[] {
  const responses: AssistantResponse[] = [];

  for (const line of jsonlContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let entry: TranscriptEntry;
    try {
      entry = JSON.parse(trimmed);
    } catch {
      continue;
    }

    if (entry.type !== 'assistant') continue;
    if (!entry.message?.content) continue;

    const text = extractTextFromContent(entry.message.content);
    if (!text.trim()) continue;

    responses.push({
      text,
      timestamp: entry.timestamp,
      uuid: entry.uuid,
      sessionId: entry.sessionId ?? path.basename(transcriptPath, '.jsonl'),
      transcriptPath,
    });
  }

  return responses;
}

export function findCurrentTranscript(currentDir: string, claudeProjectsDir: string): string | null {
  const slug = projectPathToSlug(currentDir);
  const projectDir = path.join(claudeProjectsDir, slug);

  let files: string[];
  try {
    files = readdirSync(projectDir)
      .filter(f => f.endsWith('.jsonl'))
      .map(f => path.join(projectDir, f));
  } catch {
    return null;
  }

  if (files.length === 0) return null;

  files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return files[0];
}

export function loadTranscriptResponses(transcriptPath: string): AssistantResponse[] {
  const content = readFileSync(transcriptPath, 'utf-8');
  return parseAssistantResponses(content, transcriptPath);
}
