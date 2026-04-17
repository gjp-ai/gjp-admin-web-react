import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
}

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // revokeObjectURL after a short delay so the download can start
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function serializeToMarkdown(editor: Editor): string {
  // Use prosemirror-markdown's defaultMarkdownSerializer
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { defaultMarkdownSerializer } = require('prosemirror-markdown') as typeof import('prosemirror-markdown');
    return defaultMarkdownSerializer.serialize(editor.state.doc);
  } catch {
    // Fallback: plain text
    return editor.getText();
  }
}

export default function ExportMenu({ editor }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const downloadHTML = () => {
    if (!editor) return;
    const html = `<!DOCTYPE html>\n<html>\n<body>\n${editor.getHTML()}\n</body>\n</html>`;
    triggerDownload(html, 'document.html', 'text/html');
    setOpen(false);
  };

  const downloadMarkdown = () => {
    if (!editor) return;
    const md = serializeToMarkdown(editor);
    triggerDownload(md, 'document.md', 'text/markdown');
    setOpen(false);
  };

  const copyHTML = () => {
    if (!editor) return;
    try {
      navigator.clipboard.writeText(editor.getHTML());
    } catch { /* ignore */ }
    setOpen(false);
  };

  const copyMarkdown = () => {
    if (!editor) return;
    try {
      navigator.clipboard.writeText(serializeToMarkdown(editor));
    } catch { /* ignore */ }
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="gjp-export-wrap">
      <button
        type="button"
        className="gjp-export-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Export document"
      >
        Export
        <span className="gjp-export-caret">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="gjp-export-menu" role="menu">
          <button type="button" className="gjp-export-item" role="menuitem" onClick={downloadHTML}>
            <span className="gjp-export-item-icon">⬇</span>
            Download HTML
          </button>
          <button type="button" className="gjp-export-item" role="menuitem" onClick={downloadMarkdown}>
            <span className="gjp-export-item-icon">⬇</span>
            Download Markdown
          </button>
          <div className="gjp-export-sep" />
          <button type="button" className="gjp-export-item" role="menuitem" onClick={copyHTML}>
            <span className="gjp-export-item-icon">⎘</span>
            Copy as HTML
          </button>
          <button type="button" className="gjp-export-item" role="menuitem" onClick={copyMarkdown}>
            <span className="gjp-export-item-icon">⎘</span>
            Copy as Markdown
          </button>
        </div>
      )}
    </div>
  );
}
