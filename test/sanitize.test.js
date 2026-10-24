import { describe, expect, it } from 'vitest';
import { pick, sanitizeStory } from '../server/services/sanitize';

describe('sanitizeStory', () => {
  it('keeps editor formatting', () => {
    const html = '<h1>T</h1><p><strong>b</strong> <em>i</em> <u>u</u> <code>c</code></p><ul><li>x</li></ul>';
    expect(sanitizeStory(html)).toBe(html);
  });

  it('removes scripts, event handlers and links', () => {
    expect(sanitizeStory('<p onclick="x()">hi<script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:1">l</a></p>')).toBe(
      '<p>hil</p>',
    );
  });
});

describe('pick', () => {
  it('copies only allowed, defined keys', () => {
    expect(pick({ a: 1, b: undefined, c: 3, userId: 'evil' }, ['a', 'b', 'c'])).toEqual({ a: 1, c: 3 });
  });
});
