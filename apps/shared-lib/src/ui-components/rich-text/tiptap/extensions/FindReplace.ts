import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { Node } from '@tiptap/pm/model';

export const findReplaceKey = new PluginKey<FindReplaceState>('findReplace');

export interface FindReplaceState {
  searchTerm: string;
  caseSensitive: boolean;
  currentIndex: number;
  matches: Array<{ from: number; to: number }>;
}

function buildMatches(doc: Node, term: string, caseSensitive: boolean) {
  if (!term) return [];
  const matches: Array<{ from: number; to: number }> = [];
  const needle = caseSensitive ? term : term.toLowerCase();
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    const hay = caseSensitive ? node.text : node.text.toLowerCase();
    let idx = 0;
    while ((idx = hay.indexOf(needle, idx)) !== -1) {
      matches.push({ from: pos + idx, to: pos + idx + needle.length });
      idx += needle.length;
    }
  });
  return matches;
}

export const FindReplaceExtension = Extension.create({
  name: 'findReplace',

  addProseMirrorPlugins() {
    return [
      new Plugin<FindReplaceState>({
        key: findReplaceKey,

        state: {
          init: () => ({
            searchTerm: '',
            caseSensitive: false,
            currentIndex: 0,
            matches: [],
          }),
          apply(tr, prev) {
            const meta = tr.getMeta(findReplaceKey) as Partial<FindReplaceState> | undefined;
            if (!meta && !tr.docChanged) return prev;

            const next: FindReplaceState = { ...prev, ...meta };
            // Rebuild matches on any doc change or term change
            if (tr.docChanged || meta?.searchTerm !== undefined || meta?.caseSensitive !== undefined) {
              next.matches = buildMatches(tr.doc, next.searchTerm, next.caseSensitive);
              // Clamp currentIndex
              if (next.currentIndex >= next.matches.length) {
                next.currentIndex = Math.max(0, next.matches.length - 1);
              }
            }
            return next;
          },
        },

        props: {
          decorations(state) {
            const { searchTerm, matches, currentIndex } = findReplaceKey.getState(state)!;
            if (!searchTerm || matches.length === 0) return DecorationSet.empty;

            const decos = matches.map((m, i) =>
              Decoration.inline(m.from, m.to, {
                class: i === currentIndex ? 'gjp-find-current' : 'gjp-find-match',
              }),
            );
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});

export default FindReplaceExtension;
