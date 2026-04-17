import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { NodeSelection } from '@tiptap/pm/state';
import { DOMSerializer } from '@tiptap/pm/model';

const DRAG_POS_KEY = 'application/x-gjp-block-pos';

const HANDLE_SVG = `<svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="3" cy="2"  r="1.5" fill="currentColor"/>
  <circle cx="7" cy="2"  r="1.5" fill="currentColor"/>
  <circle cx="3" cy="8"  r="1.5" fill="currentColor"/>
  <circle cx="7" cy="8"  r="1.5" fill="currentColor"/>
  <circle cx="3" cy="14" r="1.5" fill="currentColor"/>
  <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
</svg>`;

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          // Intercept drops initiated from our drag handle
          handleDrop(view, event) {
            const posData = event.dataTransfer?.getData(DRAG_POS_KEY);
            if (!posData) return false;

            const srcPos = parseInt(posData, 10);
            if (isNaN(srcPos)) return false;

            const nodeAt = view.state.doc.nodeAt(srcPos);
            if (!nodeAt) return false;

            event.preventDefault();

            const drop = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (!drop) return true;

            const nodeEnd = srcPos + nodeAt.nodeSize;
            // Drop inside the dragged node — ignore
            if (drop.pos >= srcPos && drop.pos <= nodeEnd) return true;

            // Resolve drop to a block boundary
            const $drop = view.state.doc.resolve(drop.pos);
            const insertAt = $drop.depth >= 1 ? $drop.before($drop.depth) : drop.pos;

            // Adjust insert position if it's after the removed node
            const adjustedInsert = insertAt > nodeEnd ? insertAt - nodeAt.nodeSize : insertAt;

            const tr = view.state.tr;
            tr.delete(srcPos, nodeEnd);
            const safeInsert = Math.max(0, Math.min(adjustedInsert, tr.doc.content.size));
            tr.insert(safeInsert, nodeAt);
            view.dispatch(tr);
            return true;
          },
        },

        view(editorView) {
          const handle = document.createElement('div');
          handle.className = 'gjp-drag-handle';
          handle.setAttribute('draggable', 'true');
          handle.setAttribute('contenteditable', 'false');
          handle.setAttribute('title', 'Drag to reorder block');
          handle.innerHTML = HANDLE_SVG;

          const container = editorView.dom.parentElement;
          if (container) container.appendChild(handle);

          let hoveredNodePos: number | null = null;
          let fadeTimer: ReturnType<typeof setTimeout> | null = null;

          const showHandle = () => {
            if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
            handle.style.opacity = '1';
            handle.style.pointerEvents = 'auto';
          };

          const hideHandle = () => {
            fadeTimer = setTimeout(() => {
              handle.style.opacity = '0';
              handle.style.pointerEvents = 'none';
            }, 300);
          };

          const onMouseMove = (e: MouseEvent) => {
            if (!container) return;
            try {
              const pos = editorView.posAtCoords({ left: e.clientX, top: e.clientY });
              if (!pos) { hideHandle(); return; }

              let $pos = editorView.state.doc.resolve(pos.pos);
              // Walk up to the top-level block (depth 1)
              while ($pos.depth > 1) {
                $pos = editorView.state.doc.resolve($pos.before());
              }
              const blockStart = $pos.depth >= 1 ? $pos.before($pos.depth) : 0;
              if (blockStart < 0) { hideHandle(); return; }

              const dom = editorView.nodeDOM(blockStart);
              if (!dom || !(dom instanceof HTMLElement)) { hideHandle(); return; }

              const containerRect = container.getBoundingClientRect();
              const nodeRect = dom.getBoundingClientRect();

              handle.style.top = `${nodeRect.top - containerRect.top + (nodeRect.height - 20) / 2}px`;
              hoveredNodePos = blockStart;
              showHandle();
            } catch {
              hideHandle();
            }
          };

          const onDragStart = (e: DragEvent) => {
            if (!e.dataTransfer || hoveredNodePos === null) return;
            const nodeAt = editorView.state.doc.nodeAt(hoveredNodePos);
            if (!nodeAt) return;

            // Select the node so ProseMirror is aware of what's dragged
            try {
              editorView.dispatch(
                editorView.state.tr.setSelection(
                  NodeSelection.create(editorView.state.doc, hoveredNodePos),
                ),
              );
            } catch { /* ignore */ }

            // Serialize node HTML for cross-app paste compatibility
            try {
              const serializer = DOMSerializer.fromSchema(editorView.state.schema);
              const frag = serializer.serializeFragment(nodeAt.content);
              const div = document.createElement('div');
              div.appendChild(frag);
              e.dataTransfer.setData('text/html', div.innerHTML);
            } catch { /* ignore */ }

            e.dataTransfer.setData(DRAG_POS_KEY, String(hoveredNodePos));
            e.dataTransfer.effectAllowed = 'move';
            handle.classList.add('gjp-drag-handle--dragging');
          };

          const onDragEnd = () => {
            handle.classList.remove('gjp-drag-handle--dragging');
          };

          editorView.dom.addEventListener('mousemove', onMouseMove);
          editorView.dom.addEventListener('mouseleave', hideHandle);
          handle.addEventListener('mousemove', showHandle);
          handle.addEventListener('mouseleave', hideHandle);
          handle.addEventListener('dragstart', onDragStart);
          handle.addEventListener('dragend', onDragEnd);

          return {
            destroy() {
              if (fadeTimer) clearTimeout(fadeTimer);
              editorView.dom.removeEventListener('mousemove', onMouseMove);
              editorView.dom.removeEventListener('mouseleave', hideHandle);
              handle.removeEventListener('mousemove', showHandle);
              handle.removeEventListener('mouseleave', hideHandle);
              handle.removeEventListener('dragstart', onDragStart);
              handle.removeEventListener('dragend', onDragEnd);
              handle.remove();
            },
          };
        },
      }),
    ];
  },
});

export default DragHandle;
