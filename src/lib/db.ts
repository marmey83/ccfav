// src/lib/db.ts
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import path from 'path';
import { Favourite } from '../types/index.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS favourites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  preview TEXT NOT NULL,
  project_path TEXT,
  transcript_file TEXT,
  original_timestamp TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  favourite_id INTEGER NOT NULL REFERENCES favourites(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tags_tag ON tags(tag);
CREATE INDEX IF NOT EXISTS idx_tags_favourite_id ON tags(favourite_id);
CREATE INDEX IF NOT EXISTS idx_favourites_project ON favourites(project_path);

PRAGMA foreign_keys = ON;
`;

export function createDb(dbPath: string): Database.Database {
  if (dbPath !== ':memory:') {
    mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const db = new Database(dbPath);
  db.exec(SCHEMA);
  db.pragma('foreign_keys = ON');
  return db;
}

export interface SaveInput {
  content: string;
  preview: string;
  project_path: string | null;
  transcript_file: string | null;
  original_timestamp: string | null;
  notes: string | null;
}

export function saveFavourite(db: Database.Database, input: SaveInput, tags: string[]): number {
  const insert = db.prepare(`
    INSERT INTO favourites (content, preview, project_path, transcript_file, original_timestamp, notes)
    VALUES (@content, @preview, @project_path, @transcript_file, @original_timestamp, @notes)
  `);
  const insertTag = db.prepare(`INSERT INTO tags (favourite_id, tag) VALUES (?, ?)`);

  const result = db.transaction(() => {
    const info = insert.run(input);
    const id = info.lastInsertRowid as number;
    for (const tag of tags) {
      insertTag.run(id, tag.toLowerCase().trim());
    }
    return id;
  })();

  return result;
}

interface ListOptions {
  tag?: string;
  project?: string;
  limit?: number;
}

function attachTags(db: Database.Database, rows: Omit<Favourite, 'tags'>[]): Favourite[] {
  const getTagsStmt = db.prepare('SELECT tag FROM tags WHERE favourite_id = ? ORDER BY tag');
  return rows.map(row => ({
    ...row,
    tags: (getTagsStmt.all(row.id) as { tag: string }[]).map(r => r.tag),
  }));
}

export function getFavourites(db: Database.Database, options: ListOptions): Favourite[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (options.tag) {
    conditions.push(`id IN (SELECT favourite_id FROM tags WHERE tag = ?)`);
    params.push(options.tag.toLowerCase().trim());
  }
  if (options.project) {
    conditions.push(`project_path = ?`);
    params.push(options.project);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limitClause = options.limit ? `LIMIT ${options.limit}` : '';
  const sql = `SELECT * FROM favourites ${where} ORDER BY id DESC ${limitClause}`;

  const rows = db.prepare(sql).all(...params) as Omit<Favourite, 'tags'>[];
  return attachTags(db, rows);
}

export function getFavouriteById(db: Database.Database, id: number): Favourite | null {
  const row = db.prepare('SELECT * FROM favourites WHERE id = ?').get(id) as Omit<Favourite, 'tags'> | undefined;
  if (!row) return null;
  return attachTags(db, [row])[0];
}

export function deleteFavourite(db: Database.Database, id: number): void {
  db.prepare('DELETE FROM favourites WHERE id = ?').run(id);
}

export function searchFavourites(db: Database.Database, query: string, options: ListOptions = {}): Favourite[] {
  const conditions = [`content LIKE ?`];
  const params: (string | number)[] = [`%${query}%`];

  if (options.tag) {
    conditions.push(`id IN (SELECT favourite_id FROM tags WHERE tag = ?)`);
    params.push(options.tag.toLowerCase().trim());
  }

  const sql = `SELECT * FROM favourites WHERE ${conditions.join(' AND ')} ORDER BY id DESC`;
  const rows = db.prepare(sql).all(...params) as Omit<Favourite, 'tags'>[];
  return attachTags(db, rows);
}
