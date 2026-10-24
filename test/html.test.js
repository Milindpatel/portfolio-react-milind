// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { EMPTY_DOCUMENT, deserialize, getHeading, serialize } from '../components/slate-editor/html';

describe('slate html conversion', () => {
  it('serializes blocks and marks', () => {
    const html = serialize([
      { type: 'heading-one', children: [{ text: 'Title' }] },
      { type: 'paragraph', children: [{ text: 'plain ' }, { text: 'bold', bold: true }, { text: 'both', bold: true, italic: true }] },
      { type: 'bulleted-list', children: [{ type: 'list-item', children: [{ text: 'one' }] }] },
    ]);
    expect(html).toBe(
      '<h1>Title</h1><p>plain <strong>bold</strong><strong><em>both</em></strong></p><ul><li>one</li></ul>',
    );
  });

  it('escapes HTML in text', () => {
    expect(serialize([{ type: 'paragraph', children: [{ text: '<script>alert(1)</script> & "x"' }] }])).toBe(
      '<p>&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;x&quot;</p>',
    );
  });

  it('round-trips through deserialize', () => {
    const html = '<h1>Hi</h1><h2>Sub</h2><p>a <em>b</em> <u>c</u> <code>d</code></p><blockquote>q</blockquote><ol><li>x</li></ol>';
    expect(serialize(deserialize(html))).toBe(html);
  });

  it('wraps loose top-level text in a paragraph', () => {
    expect(deserialize('hello <strong>world</strong>')).toEqual([
      { type: 'paragraph', children: [{ text: 'hello ' }, { text: 'world', bold: true }] },
    ]);
  });

  it('returns an empty document for empty input', () => {
    expect(deserialize('')).toEqual(EMPTY_DOCUMENT);
  });

  it('takes title and subtitle from the first two blocks', () => {
    expect(getHeading(deserialize('<h1>My post</h1><h2>About things</h2><p>Body</p>'))).toEqual({
      title: 'My post',
      subtitle: 'About things',
    });
    expect(getHeading(EMPTY_DOCUMENT)).toEqual({ title: 'No Title', subtitle: 'No Subtitle' });
  });
});
