import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';

const LANGUAGES = [
  'plaintext',
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'bash',
  'html',
  'css',
  'json',
  'sql',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'markdown',
  'xml',
  'yaml',
];

function CodeBlockView({ node, updateAttributes, editor }: any) {
  const lang = (node.attrs.language as string) || 'plaintext';

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    try {
      await (editor as any)?.loadCodeLanguage?.(newLang);
    } catch {
      // ignore load failures – lowlight falls back to plain
    }
    updateAttributes({ language: newLang });
  };

  return (
    <NodeViewWrapper className="gjp-code-block-wrapper">
      {/* language select — not part of the editable content */}
      <div className="gjp-code-lang-switcher" contentEditable={false}>
        <select
          className="gjp-code-lang-select"
          value={lang}
          onChange={handleChange}
          aria-label="Code block language"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      {/* pre + code receive lowlight decoration classes via ProseMirror decorations */}
      <pre className="gjp-code-block">
        <NodeViewContent as={"code" as any} className={`language-${lang}`} spellCheck={false} />
      </pre>
    </NodeViewWrapper>
  );
}

export function createCodeBlockWithLanguageSwitcher(lowlight: any) {
  return CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockView);
    },
  }).configure({
    lowlight,
    defaultLanguage: 'plaintext',
    HTMLAttributes: { class: 'gjp-code-block' },
  });
}
