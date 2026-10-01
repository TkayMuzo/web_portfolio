import React, { useEffect, useMemo, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { articleStats, sanitizeArticleHtml, toArticleHtml } from '../lib/articleContent.js';

const ToolbarButton = ({ active, children, label, onClick, disabled = false }) => (
  <button
    type="button"
    className={`article-editor__tool${active ? ' article-editor__tool--active' : ''}`}
    aria-label={label}
    aria-pressed={active}
    title={label}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default function ArticleEditor({ value, onChange }) {
  const [mode, setMode] = useState('edit');
  const initialContent = useMemo(() => toArticleHtml(value), []);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Placeholder.configure({ placeholder: 'Begin writing your article…' }),
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'article-editor__content', 'aria-label': 'Article body' } },
    onUpdate: ({ editor: instance }) => onChange(sanitizeArticleHtml(instance.getHTML())),
  });

  useEffect(() => {
    if (editor && value !== initialContent && value !== editor.getHTML()) {
      editor.commands.setContent(toArticleHtml(value), { emitUpdate: false });
    }
  }, [editor, value, initialContent]);

  const html = editor ? sanitizeArticleHtml(editor.getHTML()) : initialContent;
  const stats = articleStats(html);
  const setLink = () => {
    const url = window.prompt('Enter a link URL (https://, http://, or mailto:)');
    if (url === null) return;
    if (!/^(https?:\/\/|mailto:)/i.test(url.trim())) {
      window.alert('Use a valid https://, http://, or mailto: link.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  if (!editor) return null;
  const chain = () => editor.chain().focus();

  return (
    <section className="article-editor" aria-label="Rich text article editor">
      <div className="article-editor__tabs" role="tablist" aria-label="Article editor view">
        <button type="button" role="tab" aria-selected={mode === 'edit'} className={mode === 'edit' ? 'is-active' : ''} onClick={() => setMode('edit')}>Edit</button>
        <button type="button" role="tab" aria-selected={mode === 'preview'} className={mode === 'preview' ? 'is-active' : ''} onClick={() => setMode('preview')}>Preview</button>
        <span className="article-editor__stats" aria-live="polite">{stats.words} words · {stats.characters} characters</span>
      </div>

      {mode === 'edit' ? (
        <>
          <div className="article-editor__toolbar" role="toolbar" aria-label="Text formatting">
            <ToolbarButton label="Paragraph" active={editor.isActive('paragraph')} onClick={() => chain().setParagraph().run()}>P</ToolbarButton>
            {[1, 2, 3].map((level) => <ToolbarButton key={level} label={`Heading ${level}`} active={editor.isActive('heading', { level })} onClick={() => chain().toggleHeading({ level }).run()}>H{level}</ToolbarButton>)}
            <i />
            <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => chain().toggleBold().run()}><strong>B</strong></ToolbarButton>
            <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => chain().toggleItalic().run()}><em>I</em></ToolbarButton>
            <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => chain().toggleUnderline().run()}><u>U</u></ToolbarButton>
            <ToolbarButton label="Inline code" active={editor.isActive('code')} onClick={() => chain().toggleCode().run()}>&lt;/&gt;</ToolbarButton>
            <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => chain().toggleCodeBlock().run()}>Code</ToolbarButton>
            <i />
            <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}>• List</ToolbarButton>
            <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}>1. List</ToolbarButton>
            <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()}>“</ToolbarButton>
            <ToolbarButton label="Horizontal rule" active={false} onClick={() => chain().setHorizontalRule().run()}>—</ToolbarButton>
            <ToolbarButton label="Add or edit link" active={editor.isActive('link')} onClick={setLink}>Link</ToolbarButton>
            <ToolbarButton label="Remove link" active={false} disabled={!editor.isActive('link')} onClick={() => chain().unsetLink().run()}>Unlink</ToolbarButton>
            <i />
            <ToolbarButton label="Clear formatting" active={false} onClick={() => chain().unsetAllMarks().clearNodes().run()}>Clear</ToolbarButton>
            <ToolbarButton label="Undo" active={false} disabled={!editor.can().undo()} onClick={() => chain().undo().run()}>↶</ToolbarButton>
            <ToolbarButton label="Redo" active={false} disabled={!editor.can().redo()} onClick={() => chain().redo().run()}>↷</ToolbarButton>
          </div>
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="article-editor__preview article-prose" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </section>
  );
}
