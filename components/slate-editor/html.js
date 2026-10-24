// Converts between the Slate document model and the HTML stored in the database.

export const BLOCK_TAGS = {
  p: 'paragraph',
  blockquote: 'block-quote',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  li: 'list-item',
  h1: 'heading-one',
  h2: 'heading-two',
};

export const MARK_TAGS = { strong: 'bold', b: 'bold', em: 'italic', i: 'italic', u: 'underlined', code: 'code' };

const ELEMENT_HTML = Object.fromEntries(Object.entries(BLOCK_TAGS).map(([tag, type]) => [type, tag]));
const MARK_ORDER = [
  ['code', 'code'],
  ['underlined', 'u'],
  ['italic', 'em'],
  ['bold', 'strong'],
];

export const EMPTY_DOCUMENT = [{ type: 'paragraph', children: [{ text: '' }] }];

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function serialize(nodes) {
  return nodes.map(serializeNode).join('');
}

function serializeNode(node) {
  if (typeof node.text === 'string') {
    let html = escapeHtml(node.text);
    for (const [mark, tag] of MARK_ORDER) {
      if (node[mark]) html = `<${tag}>${html}</${tag}>`;
    }
    return html;
  }
  const tag = ELEMENT_HTML[node.type] || 'p';
  return `<${tag}>${serialize(node.children || [])}</${tag}>`;
}

function deserializeNode(el, marks) {
  if (el.nodeType === 3) {
    return el.textContent ? [{ text: el.textContent, ...marks }] : [];
  }
  if (el.nodeType !== 1) return [];

  const tag = el.nodeName.toLowerCase();
  if (tag === 'br') return [{ text: '\n', ...marks }];

  const childMarks = MARK_TAGS[tag] ? { ...marks, [MARK_TAGS[tag]]: true } : marks;
  const children = Array.from(el.childNodes).flatMap((child) => deserializeNode(child, childMarks));

  if (BLOCK_TAGS[tag]) {
    return [{ type: BLOCK_TAGS[tag], children: children.length ? children : [{ text: '' }] }];
  }
  return children;
}

/** Parses stored HTML into Slate nodes. Loose text at the top level is wrapped in paragraphs. */
export function deserialize(html) {
  if (!html) return EMPTY_DOCUMENT;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const nodes = deserializeNode(doc.body, {});

  const blocks = [];
  let loose = [];
  const flush = () => {
    if (loose.length) blocks.push({ type: 'paragraph', children: loose });
    loose = [];
  };
  for (const node of nodes) {
    if (node.type) {
      flush();
      blocks.push(node);
    } else {
      loose.push(node);
    }
  }
  flush();
  return blocks.length ? blocks : EMPTY_DOCUMENT;
}

/** The first two blocks become the blog's title and subtitle. */
export function getHeading(nodes) {
  const textOf = (node) => (node ? (node.text ?? (node.children || []).map(textOf).join('')) : '');
  return {
    title: textOf(nodes[0]).trim() || 'No Title',
    subtitle: textOf(nodes[1]).trim() || 'No Subtitle',
  };
}
