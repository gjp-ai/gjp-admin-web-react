import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

// Insert a hardBreak node directly via ProseMirror transaction.
// This is identical to what the toolbar "New line in cell" button does.
// We bypass editor.commands.setHardBreak() because it internally tries
// exitCode() first, which moves the cursor out of the cell.
function insertHardBreakInCell(editor: any): boolean {
  try {
    const { state, view } = editor;
    const hardBreakType = state?.schema?.nodes?.hardBreak;
    if (!hardBreakType || !view) return false;
    const tr = state.tr.replaceSelectionWith(hardBreakType.create(), false);
    view.dispatch(tr.scrollIntoView());
    return true;
  } catch {
    return false;
  }
}

export const CustomTableCell = TableCell.extend({
  priority: 1000,
  content: 'inline*',

  addAttributes() {
    return {
      ...((this as any).parent?.() ?? {}),

      backgroundColor: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute('data-background-color') || el.style.backgroundColor || null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.backgroundColor
            ? {
                'data-background-color': attrs.backgroundColor,
                style: `background-color: ${attrs.backgroundColor};`,
              }
            : {},
      },

      valign: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute('valign') || el.style.verticalAlign || null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.valign
            ? {
                valign: attrs.valign,
                style: `vertical-align: ${attrs.valign};`,
              }
            : {},
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }: any) => insertHardBreakInCell(editor),
      'Shift-Enter': ({ editor }: any) => insertHardBreakInCell(editor),
    };
  },
});

export const CustomTableHeader = TableHeader.extend({
  priority: 1000,
  content: 'inline*',

  addAttributes() {
    return {
      ...((this as any).parent?.() ?? {}),

      backgroundColor: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute('data-background-color') || el.style.backgroundColor || null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.backgroundColor
            ? {
                'data-background-color': attrs.backgroundColor,
                style: `background-color: ${attrs.backgroundColor};`,
              }
            : {},
      },

      valign: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute('valign') || el.style.verticalAlign || null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.valign
            ? {
                valign: attrs.valign,
                style: `vertical-align: ${attrs.valign};`,
              }
            : {},
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }: any) => insertHardBreakInCell(editor),
      'Shift-Enter': ({ editor }: any) => insertHardBreakInCell(editor),
    };
  },
});
