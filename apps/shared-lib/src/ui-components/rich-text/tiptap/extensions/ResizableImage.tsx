import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useCallback, useRef } from 'react';

function ResizableImageView({ node, updateAttributes, selected }: any) {
  const imgRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startX.current = e.clientX;
      startW.current =
        typeof node.attrs.width === 'number'
          ? node.attrs.width
          : imgRef.current?.offsetWidth || 300;

      const onMove = (ev: MouseEvent) => {
        const w = Math.max(50, Math.round(startW.current + ev.clientX - startX.current));
        updateAttributes({ width: w });
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [node.attrs.width, updateAttributes],
  );

  const w = node.attrs.width;
  const imgStyle: React.CSSProperties = {
    width: w ? (typeof w === 'number' ? `${w}px` : `${w}px`) : undefined,
    maxWidth: '100%',
    display: 'block',
  };

  return (
    <NodeViewWrapper
      as="div"
      className={`gjp-resizable-image${selected ? ' gjp-image-selected' : ''}`}
    >
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        title={node.attrs.title || ''}
        style={imgStyle}
        draggable={false}
      />
      <div
        className="gjp-resize-handle"
        onMouseDown={onMouseDown}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore – contentEditable on div prevents ProseMirror from capturing events
        contentEditable={false}
        title="Drag to resize"
      />
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          const w = el.getAttribute('width') || el.style.width?.replace('px', '');
          return w ? parseInt(w, 10) : null;
        },
        renderHTML: (attrs) =>
          attrs.width
            ? { width: String(attrs.width), style: `width: ${attrs.width}px; max-width: 100%;` }
            : {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});

export default ResizableImage;
