// tests/format.test.ts
import { describe, it, expect } from 'vitest';
import { truncate, makePreview, formatDate, pluralize } from '../src/lib/format.js';

describe('format', () => {
  it('truncates long strings with ellipsis', () => {
    expect(truncate('Hello world', 5)).toBe('Hello…');
    expect(truncate('Hi', 10)).toBe('Hi');
    expect(truncate('', 10)).toBe('');
  });

  it('makePreview takes first line up to 100 chars', () => {
    const multi = 'First line\nSecond line\nThird line';
    expect(makePreview(multi)).toBe('First line');

    const longLine = 'x'.repeat(150);
    expect(makePreview(longLine)).toBe('x'.repeat(100) + '…');
  });

  it('formats ISO timestamp to readable date', () => {
    // Just verify it returns a non-empty string and contains the year
    const result = formatDate('2026-03-21T17:45:45.049Z');
    expect(result).toContain('2026');
  });

  it('pluralizes correctly', () => {
    expect(pluralize(1, 'tag')).toBe('1 tag');
    expect(pluralize(3, 'tag')).toBe('3 tags');
    expect(pluralize(0, 'result')).toBe('0 results');
  });
});
