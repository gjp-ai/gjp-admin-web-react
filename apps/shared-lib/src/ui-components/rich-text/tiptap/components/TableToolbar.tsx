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
  merge: (
    <Svg>
      <rect x="1" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <rect x="8" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M5 7h4M7 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  ),
  split: (
    <Svg>
      <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 1v12M5 4l-2 3 2 3M9 4l2 3-2 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
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
  deleteTable: (
    <Svg viewBox="0 0 14 14">
      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M1 4.5h12M4.5 1v12" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7.5 7l2.5 2.5M10 7L7.5 9.5" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
    </Svg>
  ),
  bgColor: (
    <Svg>
      <path d="M3 10c.5-1.5 2-3 4-3s3.5 1.5 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M5.5 5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
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
  icon, title, active, danger, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  danger?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      className={`gjp-tb-btn${active ? ' is-active' : ''}${danger ? ' is-danger' : ''}`}
      title={title}
      aria-label={title}
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

  const setCellBg = (color: string | null) => {
    try {
      chain().setCellAttribute('background', color).run();
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

  return (
    <div
      className="gjp-table-toolbar"
      style={{ position: 'absolute', left: effective?.left ?? 8, top: effective?.top ?? 8, zIndex: 85 }}
      role="toolbar"
      aria-label="Table operations"
      // Keep focus inside editor — prevent toolbar clicks from losing editor selection
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* ── Row group ── */}
      <TbBtn icon={icons.rowAbove}  title="Insert row above"  onClick={cmd(() => chain().addRowBefore().run())} />
      <TbBtn icon={icons.rowBelow}  title="Insert row below"  onClick={cmd(() => chain().addRowAfter().run())} />
      <TbBtn icon={icons.deleteRow} title="Delete row"        onClick={cmd(() => chain().deleteRow().run())} />

      <Sep />

      {/* ── Column group ── */}
      <TbBtn icon={icons.colLeft}   title="Insert column left"  onClick={cmd(() => chain().addColumnBefore().run())} />
      <TbBtn icon={icons.colRight}  title="Insert column right" onClick={cmd(() => chain().addColumnAfter().run())} />
      <TbBtn icon={icons.deleteCol} title="Delete column"       onClick={cmd(() => chain().deleteColumn().run())} />

      <Sep />

      {/* ── Cell group ── */}
      <TbBtn icon={icons.merge} title="Merge selected cells" onClick={cmd(() => chain().mergeCells().run())} />
      <TbBtn icon={icons.split} title="Split cell"           onClick={cmd(() => chain().splitCell().run())} />

      <Sep />

      {/* ── Header group ── */}
      <TbBtn icon={icons.hdrRow} title="Toggle header row"    onClick={cmd(() => chain().toggleHeaderRow().run())} />
      <TbBtn icon={icons.hdrCol} title="Toggle header column" onClick={cmd(() => chain().toggleHeaderColumn().run())} />

      <Sep />

      {/* ── Cell style: vertical alignment ── */}
      <TbBtn icon={icons.valignTop}    title="Align cell top"    active={currentValign === 'top'}    onClick={(e) => { e.preventDefault(); setValign('top'); }} />
      <TbBtn icon={icons.valignMiddle} title="Align cell middle" active={currentValign === 'middle'} onClick={(e) => { e.preventDefault(); setValign('middle'); }} />
      <TbBtn icon={icons.valignBottom} title="Align cell bottom" active={currentValign === 'bottom'} onClick={(e) => { e.preventDefault(); setValign('bottom'); }} />

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

      {/* ── Delete table ── */}
      <TbBtn
        icon={icons.deleteTable}
        title="Delete table"
        danger
        onClick={cmd(() => chain().deleteTable().run())}
      />
    </div>
  );
}
