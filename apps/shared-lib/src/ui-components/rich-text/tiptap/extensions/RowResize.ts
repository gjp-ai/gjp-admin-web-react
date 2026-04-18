import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import TableRow from '@tiptap/extension-table-row';
import type { EditorView } from '@tiptap/pm/view';

const THRESHOLD = 7; // px from bottom border that activates resize mode
const MIN_ROW_HEIGHT = 24; // px

// ─── Extended TableRow with persisted height ──────────────────────────────────

export const CustomTableRow = TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      height: {
        default: null,
        parseHTML: (el: HTMLElement) => {
          const h = el.style.height;
          return h ? parseInt(h, 10) : null;
        },
        renderHTML: (attrs: Record<string, any>) =>
          attrs.height ? { style: `height: ${attrs.height}px;` } : {},
      },
    };
  },
});

// ─── Helper: detect hover near the bottom border of a <tr> ───────────────────

function findRowNearBottom(
  view: EditorView,
  event: MouseEvent,
): { pos: number; rowDOM: HTMLElement } | null {
  if (!view.editable) return null;
  try {
    const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    if (!target) return null;

    const cell = target.closest('td, th') as HTMLElement | null;
    if (!cell) return null;

    const tr = cell.closest('tr') as HTMLElement | null;
    if (!tr) return null;

    const rect = tr.getBoundingClientRect();
    // Only activate within THRESHOLD px of the bottom edge
    if (event.clientY < rect.bottom - THRESHOLD) return null;

    // Probe ProseMirror at the top of this <tr> to resolve its document pos
    const probe = view.posAtCoords({ left: event.clientX, top: rect.top + 2 });
    if (!probe) return null;

    const $pos = view.state.doc.resolve(probe.pos);
    for (let d = $pos.depth; d >= 0; d--) {
      if ($pos.node(d).type.name === 'tableRow') {
        return { pos: $pos.before(d), rowDOM: tr };
      }
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Row resize plugin ────────────────────────────────────────────────────────

const rowResizeKey = new PluginKey('rowResize');

export const RowResizeExtension = Extension.create({
  name: 'rowResize',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: rowResizeKey,

        view(editorView) {
          // State shared across event handlers (not React state — imperative for perf)
          let hoveredRow: { pos: number; rowDOM: HTMLElement } | null = null;
          let dragging = false;
          let dragPos = -1;
          let dragDOM: HTMLElement | null = null;
          let startY = 0;
          let startHeight = 0;
          let liveHeight = 0;

          const setCursor = (style: string) => {
            editorView.dom.style.cursor = style;
          };

          // ── Mouse move: hover detection + live drag ──
          const onMouseMove = (e: MouseEvent) => {
            if (dragging) {
              liveHeight = Math.max(MIN_ROW_HEIGHT, Math.round(startHeight + e.clientY - startY));
              // Directly mutate DOM for smooth 60fps feedback — no ProseMirror transaction yet
              if (dragDOM) dragDOM.style.height = `${liveHeight}px`;
              return;
            }

            const near = findRowNearBottom(editorView, e);
            hoveredRow = near;
            setCursor(near ? 'row-resize' : '');
          };

          // ── Mouse down: start drag if hovering on a row border ──
          const onMouseDown = (e: MouseEvent) => {
            if (!hoveredRow || e.button !== 0) return;
            e.preventDefault(); // prevent text selection during drag

            dragging = true;
            dragPos = hoveredRow.pos;
            dragDOM = hoveredRow.rowDOM;
            startY = e.clientY;
            startHeight = dragDOM.getBoundingClientRect().height;
            liveHeight = Math.round(startHeight);
            setCursor('row-resize');
          };

          // ── Mouse up: commit a single ProseMirror transaction (one undo entry) ──
          const onMouseUp = () => {
            if (!dragging) return;
            dragging = false;

            try {
              const { state, dispatch } = editorView;
              const row = state.doc.nodeAt(dragPos);
              if (row && row.type.name === 'tableRow') {
                dispatch(
                  state.tr.setNodeMarkup(dragPos, null, {
                    ...row.attrs,
                    height: liveHeight,
                  }),
                );
              }
            } catch { /* ignore */ }

            dragPos = -1;
            dragDOM = null;
            setCursor('');
          };

          editorView.dom.addEventListener('mousemove', onMouseMove);
          editorView.dom.addEventListener('mousedown', onMouseDown);
          // mouseup on document so releasing outside the editor still commits
          document.addEventListener('mouseup', onMouseUp);

          return {
            destroy() {
              editorView.dom.removeEventListener('mousemove', onMouseMove);
              editorView.dom.removeEventListener('mousedown', onMouseDown);
              document.removeEventListener('mouseup', onMouseUp);
            },
          };
        },
      }),
    ];
  },
});
