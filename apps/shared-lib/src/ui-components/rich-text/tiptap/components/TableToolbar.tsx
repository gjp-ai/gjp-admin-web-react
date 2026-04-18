import { useState } from 'react';
import type { Editor } from '@tiptap/react';

// ─── SVG icon helpers ──────────────────────────────────────────────────────────

const Svg = ({ children, ...p }: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" {...p}>
    {children}
  </svg>
);

const icons = {
  rowAbove: (
    <Svg>
      <rect x="1" y="7" width="12" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 5V1M5 3l2-2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  rowBelow: (
    <Svg>
      <rect x="1" y="2" width="12" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 9v4M5 11l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  deleteRow: (
    <Svg>
      <rect x="1" y="4" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M5 7h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </Svg>
  ),
  colLeft: (
    <Svg>
      <rect x="7" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M5 7H1M3 5l-2 2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  colRight: (
    <Svg>
      <rect x="2" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M9 7h4M11 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  deleteCol: (
    <Svg>
      <rect x="4" y="1" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </Svg>
  ),
  mergeOrSplit: (
    <Svg>
      <rect x="1" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <rect x="8" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M5 7h4M7 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  hdrRow: (
    <Svg>
      <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <rect x="1" y="1" width="12" height="4" rx="1" fill="currentColor" opacity="0.35"/>
      <path d="M1 5h12" stroke="currentColor" strokeWidth="1.2"/>
    </Svg>
  ),
  hdrCol: (
    <Svg>
      <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <rect x="1" y="1" width="4" height="12" rx="1" fill="currentColor" opacity="0.35"/>
      <path d="M5 1v12" stroke="currentColor" strokeWidth="1.2"/>
    </Svg>
  ),
  hdrCell: (
    <Svg>
      <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <rect x="4" y="4" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.35"/>
    </Svg>
  ),
  valignTop: (
    <Svg>
      <path d="M1 2h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="4" y="4" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 4v7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </Svg>
  ),
  valignMiddle: (
    <Svg>
      <path d="M1 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="4" y="2" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 2v10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </Svg>
  ),
  valignBottom: (
    <Svg>
      <path d="M1 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="4" y="3" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 3v7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </Svg>
  ),
  bgColor: (
    <Svg>
      <path d="M3 10c.5-1.5 2-3 4-3s3.5 1.5 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M5.5 5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </Svg>
  ),
  alignLeft: (
    <Svg>
      <path d="M2 3h10M2 6h7M2 9h10M2 12h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  ),
  alignCenter: (
    <Svg>
      <path d="M2 3h10M3.5 6h7M2 9h10M3.5 12h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  ),
  alignRight: (
    <Svg>
      <path d="M2 3h10M5 6h7M2 9h10M5 12h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  ),
  fixTable: (
    <Svg>
      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M1 4.5h12M4.5 1v12" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6 7.5l1.2 1.2L9 6.5" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  nextCell: (
    <Svg>
      <path d="M2 7h8M8 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </Svg>
  ),
  prevCell: (
    <Svg>
      <path d="M12 7H4M4 5L2 7l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 3v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </Svg>
  ),
  deleteTable: (
    <Svg viewBox="0 0 14 14">
      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M1 4.5h12M4.5 1v12" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7.5 7l2.5 2.5M10 7L7.5 9.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
    </Svg>
  ),
  newLine: (
    <Svg viewBox="0 0 14 14">
      {/* Arrow: go right then bend down-left — classic ↵ return symbol */}
      <path d="M12 3v4a1 1 0 0 1-1 1H3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M5.5 5.5L3 8l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </Svg>
  ),
};

// ─── Cell background color swatches ───────────────────────────────────────────

const CELL_COLORS = [
  { value: null,      label: 'Clear',   style: { background: '#fff', border: '1px dashed #d1d5db' } },
  { value: '#fef9c3', label: 'Yellow',  style: { background: '#fef9c3' } },
  { value: '#dcfce7', label: 'Green',   style: { background: '#dcfce7' } },
  { value: '#dbeafe', label: 'Blue',    style: { background: '#dbeafe' } },
  { value: '#fce7f3', label: 'Pink',    style: { background: '#fce7f3' } },
  { value: '#ede9fe', label: 'Purple',  style: { background: '#ede9fe' } },
  { value: '#ffedd5', label: 'Orange',  style: { background: '#ffedd5' } },
  { value: '#f1f5f9', label: 'Gray',    style: { background: '#f1f5f9' } },
  { value: '#1e293b', label: 'Dark',    style: { background: '#1e293b' } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cmd(fn: () => void) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    try { fn(); } catch { /* ignore */ }
  };
}

function TbBtn({
  icon, title, active, danger, disabled, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      className={`gjp-tb-btn${active ? ' is-active' : ''}${danger ? ' is-danger' : ''}`}
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={onClick}
    >
      {icon}
    </button>
  );
}

function Sep() {
  return <span className="gjp-table-toolbar-sep" />;
}

// ─── Main component ────────────────────────────────────────────────────────────

interface TableToolbarProps {
  editor: Editor | null;
  visible: boolean;
  selToolbarOpen: boolean;
  selToolbarCoords: { left: number; top: number } | null;
  tableToolbarCoords: { left: number; top: number } | null;
}

export default function TableToolbar(props: Readonly<TableToolbarProps>) {
  const { editor, visible, selToolbarOpen, selToolbarCoords, tableToolbarCoords } = props;
  const [showBgPicker, setShowBgPicker] = useState(false);

  if (!visible || !editor) return null;

  // Compute effective coords to avoid overlapping selection toolbar
  const effective = (() => {
    if (!tableToolbarCoords) return tableToolbarCoords;
    try {
      if (selToolbarOpen && selToolbarCoords) {
        const selBottom = selToolbarCoords.top + 40;
        if ((tableToolbarCoords.top ?? 0) < selBottom + 8) {
          return { left: tableToolbarCoords.left, top: selBottom + 8 };
        }
      }
    } catch { /* ignore */ }
    return tableToolbarCoords;
  })();

  const chain = () => (editor.chain() as any).focus();
  const can = () => (editor.can() as any);

  const setCellBg = (color: string | null) => {
    try {
      chain().setCellAttribute('backgroundColor', color).run();
    } catch { /* ignore */ }
    setShowBgPicker(false);
  };

  const setValign = (val: 'top' | 'middle' | 'bottom') => {
    try {
      chain().setCellAttribute('valign', val).run();
    } catch { /* ignore */ }
  };

  const currentValign = (() => {
    try {
      const { $from } = editor.state.selection;
      for (let d = $from.depth; d >= 0; d--) {
        const node = $from.node(d);
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
          return (node.attrs as any).valign || 'middle';
        }
      }
    } catch { /* ignore */ }
    return 'middle';
  })();

  // Determine if merge or split is appropriate for the smart button
  const canMerge = (() => { try { return can().mergeCells(); } catch { return false; } })();
  const canSplit = (() => { try { return can().splitCell(); } catch { return false; } })();

  return (
    <div
      className="gjp-table-toolbar"
      style={{ position: 'absolute', left: effective?.left ?? 8, top: effective?.top ?? 8, zIndex: 85 }}
      role="toolbar"
      aria-label="Table operations"
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* ── Row group ── */}
      <TbBtn icon={icons.rowAbove}  title="Insert row above"  disabled={!can().addRowBefore()} onClick={cmd(() => chain().addRowBefore().run())} />
      <TbBtn icon={icons.rowBelow}  title="Insert row below"  disabled={!can().addRowAfter()}  onClick={cmd(() => chain().addRowAfter().run())} />
      <TbBtn icon={icons.deleteRow} title="Delete row"        disabled={!can().deleteRow()}    onClick={cmd(() => chain().deleteRow().run())} />

      <Sep />

      {/* ── Column group ── */}
      <TbBtn icon={icons.colLeft}   title="Insert column left"  disabled={!can().addColumnBefore()} onClick={cmd(() => chain().addColumnBefore().run())} />
      <TbBtn icon={icons.colRight}  title="Insert column right" disabled={!can().addColumnAfter()}  onClick={cmd(() => chain().addColumnAfter().run())} />
      <TbBtn icon={icons.deleteCol} title="Delete column"       disabled={!can().deleteColumn()}    onClick={cmd(() => chain().deleteColumn().run())} />

      <Sep />

      {/* ── Merge / Split (smart single button) ── */}
      <TbBtn
        icon={icons.mergeOrSplit}
        title={canMerge ? 'Merge selected cells' : 'Split cell'}
        disabled={!canMerge && !canSplit}
        onClick={cmd(() => canMerge ? chain().mergeCells().run() : chain().splitCell().run())}
      />

      <Sep />

      {/* ── Header group ── */}
      <TbBtn icon={icons.hdrRow}  title="Toggle header row"    disabled={!can().toggleHeaderRow()}    onClick={cmd(() => chain().toggleHeaderRow().run())} />
      <TbBtn icon={icons.hdrCol}  title="Toggle header column" disabled={!can().toggleHeaderColumn()} onClick={cmd(() => chain().toggleHeaderColumn().run())} />
      <TbBtn icon={icons.hdrCell} title="Toggle header cell"   disabled={!can().toggleHeaderCell()}   onClick={cmd(() => chain().toggleHeaderCell().run())} />

      <Sep />

      {/* ── Cell navigation ── */}
      <TbBtn icon={icons.nextCell} title="Go to next cell (Tab)"      onClick={cmd(() => chain().goToNextCell().run())} />
      <TbBtn icon={icons.prevCell} title="Go to previous cell (⇧Tab)" onClick={cmd(() => chain().goToPreviousCell().run())} />
      <TbBtn
        icon={icons.newLine}
        title="New line in cell (↵)"
        onClick={(e) => {
          e.preventDefault();
          try {
            // Direct ProseMirror transaction — bypasses Tiptap's setHardBreak
            // which internally tries exitCode() first (wrong inside table cells).
            const { state, view } = editor;
            const hardBreakType = state.schema.nodes.hardBreak;
            if (!hardBreakType || !view) return;
            const tr = state.tr.replaceSelectionWith(hardBreakType.create(), false);
            view.dispatch(tr.scrollIntoView());
            // Return focus to editor so cursor is visible
            view.focus();
          } catch { /* ignore */ }
        }}
      />

      <Sep />

      {/* ── Cell style: vertical alignment ── */}
      <TbBtn icon={icons.valignTop}    title="Align cell top"    active={currentValign === 'top'}    onClick={(e) => { e.preventDefault(); setValign('top'); }} />
      <TbBtn icon={icons.valignMiddle} title="Align cell middle" active={currentValign === 'middle'} onClick={(e) => { e.preventDefault(); setValign('middle'); }} />
      <TbBtn icon={icons.valignBottom} title="Align cell bottom" active={currentValign === 'bottom'} onClick={(e) => { e.preventDefault(); setValign('bottom'); }} />

      <Sep />

      {/* ── Cell style: horizontal alignment ── */}
      <TbBtn icon={icons.alignLeft}   title="Align text left"   active={editor.isActive({ textAlign: 'left' })}   onClick={(e) => { e.preventDefault(); chain().setTextAlign('left').run(); }} />
      <TbBtn icon={icons.alignCenter} title="Align text center" active={editor.isActive({ textAlign: 'center' })} onClick={(e) => { e.preventDefault(); chain().setTextAlign('center').run(); }} />
      <TbBtn icon={icons.alignRight}  title="Align text right"  active={editor.isActive({ textAlign: 'right' })}  onClick={(e) => { e.preventDefault(); chain().setTextAlign('right').run(); }} />

      <Sep />

      {/* ── Cell background color ── */}
      <div style={{ position: 'relative' }}>
        <TbBtn
          icon={icons.bgColor}
          title="Cell background color"
          active={showBgPicker}
          onClick={(e) => { e.preventDefault(); setShowBgPicker((s) => !s); }}
        />
        {showBgPicker && (
          <div className="gjp-tb-color-popup" role="listbox" aria-label="Cell background color">
            {CELL_COLORS.map(({ value, label, style }) => (
              <button
                key={label}
                type="button"
                className="gjp-tb-color-swatch"
                title={label}
                aria-label={`Cell background: ${label}`}
                style={style as React.CSSProperties}
                onMouseDown={(e) => { e.preventDefault(); setCellBg(value); }}
              />
            ))}
          </div>
        )}
      </div>

      <Sep />

      {/* ── Fix tables (repair invalid table structure) ── */}
      <TbBtn icon={icons.fixTable} title="Fix table structure" onClick={cmd(() => chain().fixTables().run())} />

      <Sep />

      {/* ── Delete table ── */}
      <TbBtn
        icon={icons.deleteTable}
        title="Delete table"
        danger
        disabled={!can().deleteTable()}
        onClick={cmd(() => chain().deleteTable().run())}
      />
    </div>
  );
}
