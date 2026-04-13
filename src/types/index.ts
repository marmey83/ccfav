// src/types/index.ts

export interface TranscriptEntry {
  type: string;
  message?: {
    role: string;
    content: ContentBlock[];
  };
  timestamp: string;
  uuid: string;
  cwd?: string;
  sessionId?: string;
  slug?: string;
}

export interface ContentBlock {
  type: 'text' | 'thinking' | 'tool_use' | 'tool_result';
  text?: string;
  thinking?: string;
}

export interface AssistantResponse {
  text: string;           // joined text content
  timestamp: string;
  uuid: string;
  sessionId: string;
  transcriptPath: string;
}

export interface Favourite {
  id: number;
  content: string;
  preview: string;
  project_path: string | null;
  transcript_file: string | null;
  original_timestamp: string | null;
  created_at: string;
  notes: string | null;
  tags: string[];
}

export interface SaveOptions {
  tags?: string[];
  note?: string;
}
