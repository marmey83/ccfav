// tests/db.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createDb, saveFavourite, getFavourites, getFavouriteById, deleteFavourite, searchFavourites } from '../src/lib/db.js';
import Database from 'better-sqlite3';

function makeTestDb(): Database.Database {
  return createDb(':memory:');
}

describe('db', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = makeTestDb();
  });

  it('saves and retrieves a favourite', () => {
    const id = saveFavourite(db, {
      content: 'Hello world response',
      preview: 'Hello world resp',
      project_path: '/Users/test/project',
      transcript_file: 'session1.jsonl',
      original_timestamp: '2026-01-01T00:00:00Z',
      notes: null,
    }, ['auth', 'nourli']);

    expect(id).toBeTypeOf('number');
    expect(id).toBeGreaterThan(0);

    const fav = getFavouriteById(db, id);
    expect(fav).not.toBeNull();
    expect(fav!.content).toBe('Hello world response');
    expect(fav!.tags).toEqual(['auth', 'nourli']);
  });

  it('lists favourites newest first', () => {
    saveFavourite(db, { content: 'First', preview: 'First', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, []);
    saveFavourite(db, { content: 'Second', preview: 'Second', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, ['tag1']);

    const favs = getFavourites(db, {});
    expect(favs).toHaveLength(2);
    expect(favs[0].content).toBe('Second');
    expect(favs[1].content).toBe('First');
  });

  it('filters by tag', () => {
    saveFavourite(db, { content: 'Tagged', preview: 'Tagged', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, ['auth']);
    saveFavourite(db, { content: 'Not tagged', preview: 'Not tagged', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, []);

    const results = getFavourites(db, { tag: 'auth' });
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('Tagged');
  });

  it('deletes a favourite', () => {
    const id = saveFavourite(db, { content: 'To delete', preview: 'To delete', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, []);
    deleteFavourite(db, id);
    expect(getFavouriteById(db, id)).toBeNull();
  });

  it('searches favourites by content', () => {
    saveFavourite(db, { content: 'tombstone pattern in auth', preview: 'tombstone...', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, []);
    saveFavourite(db, { content: 'something else entirely', preview: 'something...', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, []);

    const results = searchFavourites(db, 'tombstone');
    expect(results).toHaveLength(1);
    expect(results[0].content).toContain('tombstone');
  });

  it('cascades tag deletion when favourite is deleted', () => {
    const id = saveFavourite(db, { content: 'test', preview: 'test', project_path: null, transcript_file: null, original_timestamp: null, notes: null }, ['mytag']);
    deleteFavourite(db, id);

    const tags = db.prepare('SELECT * FROM tags WHERE favourite_id = ?').all(id);
    expect(tags).toHaveLength(0);
  });
});
