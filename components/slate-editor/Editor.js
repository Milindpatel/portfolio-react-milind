import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'reactstrap';
import { Editor, Element as SlateElement, Range, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, useFocused, useSlate, withReact } from 'slate-react';
import { EMPTY_DOCUMENT, deserialize, getHeading, serialize } from './html';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const INITIAL_VALUE = [
  { type: 'heading-one', children: [{ text: 'Your title' }] },
  { type: 'heading-two', children: [{ text: 'A short subtitle' }] },
  { type: 'paragraph', children: [{ text: 'Start writing your story...' }] },
];

function isMarkActive(editor, format) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function toggleMark(editor, format) {
  if (isMarkActive(editor, format)) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
}

function isBlockActive(editor, format) {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
}

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  });
  Transforms.setNodes(editor, { type: isActive ? 'paragraph' : isList ? 'list-item' : format });
  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] });
  }
}

function renderElement({ attributes, children, element }) {
  switch (element.type) {
    case 'block-quote': return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list': return <ul {...attributes}>{children}</ul>;
    case 'numbered-list': return <ol {...attributes}>{children}</ol>;
    case 'list-item': return <li {...attributes}>{children}</li>;
    case 'heading-one': return <h1 {...attributes}>{children}</h1>;
    case 'heading-two': return <h2 {...attributes}>{children}</h2>;
    default: return <p {...attributes}>{children}</p>;
  }
}

function renderLeaf({ attributes, children, leaf }) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underlined) children = <u>{children}</u>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
}

const MARK_BUTTONS = [
  ['bold', 'B', 'Bold'],
  ['italic', 'I', 'Italic'],
  ['underlined', 'U', 'Underline'],
  ['code', '</>', 'Code'],
];
const BLOCK_BUTTONS = [
  ['heading-one', 'H1', 'Heading 1'],
  ['heading-two', 'H2', 'Heading 2'],
  ['block-quote', '“', 'Quote'],
  ['numbered-list', '1.', 'Numbered list'],
  ['bulleted-list', '•', 'Bulleted list'],
];

/** Formatting toolbar that floats above the selected text. */
function HoverMenu() {
  const ref = useRef(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const menu = ref.current;
    const { selection } = editor;
    if (!menu) return;
    if (!selection || !inFocus || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
      menu.removeAttribute('style');
      return;
    }
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;
    const rect = domSelection.getRangeAt(0).getBoundingClientRect();
    menu.style.opacity = '1';
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight - 6}px`;
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`;
  });

  return createPortal(
    <div ref={ref} className="slate-hover-menu" onMouseDown={(e) => e.preventDefault()}>
      {MARK_BUTTONS.map(([format, label, title]) => (
        <button key={format} type="button" title={title} aria-label={title}
          className={isMarkActive(editor, format) ? 'active' : ''} onClick={() => toggleMark(editor, format)}>
          {label}
        </button>
      ))}
      {BLOCK_BUTTONS.map(([format, label, title]) => (
        <button key={format} type="button" title={title} aria-label={title}
          className={isBlockActive(editor, format) ? 'active' : ''} onClick={() => toggleBlock(editor, format)}>
          {label}
        </button>
      ))}
    </div>,
    document.body,
  );
}

/**
 * Rich text editor for blog posts. The first block is the title, the second
 * the subtitle. Ctrl/Cmd+S saves. Select text to see the formatting menu.
 */
export default function SlateEditor({ initialValue, isLoading, save }) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value] = useState(() => (initialValue ? deserialize(initialValue) : INITIAL_VALUE));

  const doSave = useCallback(() => {
    if (isLoading) return;
    const nodes = editor.children.length ? editor.children : EMPTY_DOCUMENT;
    save(serialize(nodes), getHeading(nodes));
  }, [editor, isLoading, save]);

  const onKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      doSave();
    }
  };

  return (
    <>
      <div className="controll-menu">
        <h1 className="title">Write your story...</h1>
        <div className="status-box">{isLoading ? 'Saving...' : 'Saved'}</div>
        <Button disabled={isLoading} onClick={doSave} color="success">Save</Button>
      </div>
      <Slate editor={editor} initialValue={value}>
        <HoverMenu />
        <Editable className="slate-editable" renderElement={renderElement} renderLeaf={renderLeaf}
          placeholder="Enter some text..." onKeyDown={onKeyDown} spellCheck autoFocus />
      </Slate>
    </>
  );
}
