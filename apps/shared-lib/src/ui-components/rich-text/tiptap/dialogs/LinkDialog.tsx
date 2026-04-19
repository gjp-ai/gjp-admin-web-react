import { useMemo } from 'react';
import { Editor } from '@tiptap/react';
import DOMPurify from 'dompurify';
import * as tiptapStyles from '../styles/inlineStyles';
import DialogWrapper from './DialogWrapper';

export interface LinkForm { url: string; text: string; openInNewTab: boolean }

interface LinkDialogProps {
  editor: Editor | null;
  open: boolean;
  overlayRef: React.RefObject<HTMLDialogElement | null>;
  form: LinkForm;
  setForm: (f: LinkForm) => void;
  onClose: () => void;
  selection?: { from: number; to: number } | null;
}

export default function LinkDialog(props: Readonly<LinkDialogProps>) {
  const { editor, open, overlayRef, form, setForm, onClose, selection } = props;
  if (!open) return null;

  const cleanedUrl = form.url.trim();
  const cleanedText = form.text.trim();
  const hasUrl = cleanedUrl.length > 0;

  const isValidUrl = useMemo(() => {
    if (!hasUrl) return false;
    try {
      const url = new URL(cleanedUrl);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }, [cleanedUrl, hasUrl]);

  const previewText = cleanedText || cleanedUrl;
  const sanitizedPreviewText = DOMPurify.sanitize(previewText);

  return (
    <DialogWrapper open={open} overlayRef={overlayRef} onClose={onClose} width={520}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { url, text } = form;
          if (!url) return;
          
          try {
            const hasSelection = selection && selection.from !== selection.to;
            const safeText = text || url; // no need to DOMPurify if we use JSON text node
            const linkAttrs = {
              href: url,
              target: form.openInNewTab ? '_blank' : '_self',
              rel: form.openInNewTab ? 'noopener noreferrer' : null,
            };

            if (hasSelection && selection && editor) {
              try {
                const pos = selection.from;
                editor.chain()
                  .insertContentAt({ from: selection.from, to: selection.to }, {
                    type: 'text',
                    text: safeText,
                    marks: [{ type: 'link', attrs: linkAttrs }]
                  })
                  .run();
                const cursorPos = pos + safeText.length;
                editor.chain().focus(undefined, { scrollIntoView: false }).setTextSelection(cursorPos).run();
              } catch {
                editor.chain()
                  .setTextSelection({ from: selection.from, to: selection.to })
                  .extendMarkRange('link')
                  .setLink(linkAttrs)
                  .focus(undefined, { scrollIntoView: false })
                  .run();
              }
            } else if (selection && editor) {
              const pos = selection.from;
              editor.chain()
                .insertContentAt(pos, {
                  type: 'text',
                  text: safeText,
                  marks: [{ type: 'link', attrs: linkAttrs }]
                })
                .run();
              const cursorPos = pos + safeText.length;
              editor.chain().focus(undefined, { scrollIntoView: false }).setTextSelection(cursorPos).run();
            } else {
              editor?.chain()
                .focus(undefined, { scrollIntoView: false })
                .insertContent({
                  type: 'text',
                  text: safeText,
                  marks: [{ type: 'link', attrs: linkAttrs }]
                })
                .run();
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to insert link from dialog', err);
          }
          onClose();
        }}
        style={tiptapStyles.dialogFormStyle}
      >
        <header style={tiptapStyles.dialogHeaderStyle}>
          <h3 style={tiptapStyles.dialogTitleStyle}>Insert link</h3>
          <p style={tiptapStyles.dialogDescriptionStyle}>
            Point readers to another page and (optionally) customise the text that appears in the editor.
          </p>
        </header>

        <div style={tiptapStyles.dialogBodyStyle}>
          <div style={tiptapStyles.dialogFieldColumnStyle}>
            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-link-url" style={tiptapStyles.dialogLabelStyle}>Destination URL</label>
              <input
                id="gjp-link-url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com/article"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>
                Use a secure URL (https://) for best compatibility and reader trust.
              </span>
            </div>

            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-link-text" style={tiptapStyles.dialogLabelStyle}>Text to display</label>
              <input
                id="gjp-link-text"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Leave empty to show the URL"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>
                If left blank the full URL will be inserted. You can change the label later from the editor.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <input
                id="gjp-link-blank"
                type="checkbox"
                checked={!!form.openInNewTab}
                onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="gjp-link-blank" style={{ ...tiptapStyles.dialogLabelStyle, marginBottom: 0, cursor: 'pointer' }}>
                Open link in a new tab
              </label>
            </div>
          </div>

          <aside style={tiptapStyles.dialogPreviewWrapperStyle}>
            <div style={tiptapStyles.dialogPreviewSurfaceStyle}>
              {hasUrl ? (
                <a
                  href={isValidUrl ? cleanedUrl : undefined}
                  target={form.openInNewTab ? '_blank' : undefined}
                  rel={form.openInNewTab ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: isValidUrl ? '#0f172a' : '#9ca3af',
                    textDecoration: isValidUrl ? 'none' : 'line-through',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(15,23,42,0.08)',
                    }}
                  >
                    🔗
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: sanitizedPreviewText }} />
                </a>
              ) : (
                <div style={tiptapStyles.dialogPreviewEmptyStyle}>A preview link will appear here.</div>
              )}
            </div>
            <span style={tiptapStyles.dialogHintStyle}>
              {isValidUrl
                ? `Preview uses the current values. Link opens in ${form.openInNewTab ? 'a new' : 'the current'} tab once inserted.`
                : hasUrl
                  ? 'Enter a valid http(s) URL to enable the insert button.'
                  : 'Provide a URL to enable the insert button.'}
            </span>
          </aside>
        </div>
        <div style={tiptapStyles.dialogFooterStyle}>
          <button type="button" style={tiptapStyles.secondaryButtonStyle} onClick={() => onClose()}>Cancel</button>
          <button type="submit" style={tiptapStyles.primaryButtonStyle} disabled={!isValidUrl}>Insert link</button>
        </div>
      </form>
    </DialogWrapper>
  );
}
