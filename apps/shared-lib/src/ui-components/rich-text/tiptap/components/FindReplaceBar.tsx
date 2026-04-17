import type { useFindReplace } from '../hooks/useFindReplace';

type Props = ReturnType<typeof useFindReplace>;

export default function FindReplaceBar(props: Readonly<Props>) {
  const {
    open,
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
  } = props;

  if (!open) return null;

  const hasMatches = matchCount > 0;
  const counter = hasMatches ? `${currentIndex + 1} / ${matchCount}` : searchTerm ? '0 results' : '';

  return (
    <div className="gjp-find-bar" role="search" aria-label="Find and replace">
      {/* ── Find row ── */}
      <div className="gjp-find-row">
        <div className="gjp-find-input-wrap">
          <input
            ref={inputRef}
            className="gjp-find-input"
            type="text"
            placeholder="Find…"
            value={searchTerm}
            aria-label="Search text"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.shiftKey ? findPrev() : findNext(); }
              if (e.key === 'Escape') closeFind();
            }}
          />
          {counter && (
            <span className={`gjp-find-counter${!hasMatches ? ' gjp-find-counter--none' : ''}`}>
              {counter}
            </span>
          )}
        </div>

        <button
          type="button"
          className={`gjp-find-btn gjp-find-btn--icon${caseSensitive ? ' is-active' : ''}`}
          title="Match case"
          aria-pressed={caseSensitive}
          onClick={() => setCaseSensitive(!caseSensitive)}
        >
          Aa
        </button>

        <button
          type="button"
          className="gjp-find-btn gjp-find-btn--icon"
          title="Previous match (Shift+Enter)"
          disabled={!hasMatches}
          onClick={findPrev}
          aria-label="Previous match"
        >
          ↑
        </button>
        <button
          type="button"
          className="gjp-find-btn gjp-find-btn--icon"
          title="Next match (Enter)"
          disabled={!hasMatches}
          onClick={findNext}
          aria-label="Next match"
        >
          ↓
        </button>
        <button
          type="button"
          className="gjp-find-btn gjp-find-btn--close"
          title="Close (Esc)"
          onClick={closeFind}
          aria-label="Close find bar"
        >
          ✕
        </button>
      </div>

      {/* ── Replace row ── */}
      <div className="gjp-find-row">
        <input
          className="gjp-find-input"
          type="text"
          placeholder="Replace with…"
          value={replaceTerm}
          aria-label="Replace text"
          onChange={(e) => setReplaceTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') closeFind(); }}
        />
        <button
          type="button"
          className="gjp-find-btn"
          disabled={!hasMatches}
          onClick={replaceNext}
          title="Replace current match"
        >
          Replace
        </button>
        <button
          type="button"
          className="gjp-find-btn"
          disabled={!hasMatches}
          onClick={replaceAll}
          title="Replace all matches"
        >
          All
        </button>
      </div>
    </div>
  );
}
