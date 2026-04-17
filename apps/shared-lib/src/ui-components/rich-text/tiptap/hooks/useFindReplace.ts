import { useCallback, useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { findReplaceKey } from '../extensions/FindReplace';

export function useFindReplace(editor: Editor | null) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTermState] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitiveState] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentIndex, setCurrentIndexState] = useState(0);

  // Sync match count from plugin state after each editor update
  useEffect(() => {
    if (!editor) return undefined;
    const sync = () => {
      try {
        const ps = findReplaceKey.getState(editor.state);
        if (ps) {
          setMatchCount(ps.matches.length);
          setCurrentIndexState(ps.currentIndex);
        }
      } catch { /* ignore */ }
    };
    editor.on('update', sync);
    editor.on('selectionUpdate', sync);
    return () => {
      try {
        editor.off('update', sync);
        editor.off('selectionUpdate', sync);
      } catch { /* ignore */ }
    };
  }, [editor]);

  const dispatch = useCallback(
    (patch: Record<string, unknown>) => {
      if (!editor) return;
      try {
        editor.view.dispatch(editor.state.tr.setMeta(findReplaceKey, patch));
      } catch { /* ignore */ }
    },
    [editor],
  );

  const setSearchTerm = useCallback(
    (term: string) => {
      setSearchTermState(term);
      dispatch({ searchTerm: term, currentIndex: 0 });
    },
    [dispatch],
  );

  const setCaseSensitive = useCallback(
    (cs: boolean) => {
      setCaseSensitiveState(cs);
      dispatch({ caseSensitive: cs, currentIndex: 0 });
    },
    [dispatch],
  );

  const navigateTo = useCallback(
    (idx: number) => {
      if (!editor) return;
      try {
        const ps = findReplaceKey.getState(editor.state);
        if (!ps || ps.matches.length === 0) return;
        const clamped = ((idx % ps.matches.length) + ps.matches.length) % ps.matches.length;
        dispatch({ currentIndex: clamped });
        // Scroll match into view by setting cursor there
        const m = ps.matches[clamped];
        try {
          editor.view.dispatch(editor.state.tr.setMeta(findReplaceKey, { currentIndex: clamped }));
          editor.commands.setTextSelection({ from: m.from, to: m.to });
          editor.commands.scrollIntoView();
        } catch { /* ignore */ }
      } catch { /* ignore */ }
    },
    [editor, dispatch],
  );

  const findNext = useCallback(() => {
    try {
      const ps = findReplaceKey.getState(editor!.state);
      if (!ps || ps.matches.length === 0) return;
      navigateTo(ps.currentIndex + 1);
    } catch { /* ignore */ }
  }, [editor, navigateTo]);

  const findPrev = useCallback(() => {
    try {
      const ps = findReplaceKey.getState(editor!.state);
      if (!ps || ps.matches.length === 0) return;
      navigateTo(ps.currentIndex - 1);
    } catch { /* ignore */ }
  }, [editor, navigateTo]);

  const replaceNext = useCallback(() => {
    if (!editor || !searchTerm) return;
    try {
      const ps = findReplaceKey.getState(editor.state);
      if (!ps || ps.matches.length === 0) return;
      const m = ps.matches[ps.currentIndex];
      if (!m) return;
      editor.chain()
        .setTextSelection({ from: m.from, to: m.to })
        .insertContent(replaceTerm)
        .run();
    } catch { /* ignore */ }
  }, [editor, searchTerm, replaceTerm]);

  const replaceAll = useCallback(() => {
    if (!editor || !searchTerm) return;
    try {
      const ps = findReplaceKey.getState(editor.state);
      if (!ps || ps.matches.length === 0) return;
      // Apply in reverse so positions stay valid
      const sorted = [...ps.matches].sort((a, b) => b.from - a.from);
      let tr = editor.state.tr;
      for (const m of sorted) {
        tr = tr.replaceWith(m.from, m.to, editor.state.schema.text(replaceTerm || ''));
      }
      editor.view.dispatch(tr);
    } catch { /* ignore */ }
  }, [editor, searchTerm, replaceTerm]);

  const closeFind = useCallback(() => {
    setOpen(false);
    setSearchTerm('');
    setReplaceTerm('');
  }, [setSearchTerm]);

  // Clear decorations when closed
  useEffect(() => {
    if (!open) dispatch({ searchTerm: '' });
  }, [open, dispatch]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    caseSensitive,
    setCaseSensitive,
    matchCount,
    currentIndex,
    findNext,
    findPrev,
    replaceNext,
    replaceAll,
    closeFind,
    inputRef,
  };
}
