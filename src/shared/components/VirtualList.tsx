import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';

import { useListViewport } from '../hooks/useListViewport';

import {
  defaultRangeExtractor,
  useVirtualizer,
  useWindowVirtualizer,
} from '@tanstack/react-virtual';

interface VirtualListProps<T> extends Omit<
  HTMLAttributes<HTMLUListElement>,
  'children'
> {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  estimateSize: number;
  listRef?: Ref<HTMLUListElement>;
  rowClassName?: string;
  emptyState?: ReactNode;
  retainedItemKey?: string | null;
}

export const VirtualList = <T,>({
  items,
  getKey,
  renderItem,
  estimateSize,
  listRef,
  rowClassName,
  emptyState,
  retainedItemKey,
  ...props
}: VirtualListProps<T>) => {
  const ref = useRef<HTMLUListElement>(null);
  const { windowScroll, margin } = useListViewport(ref);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  const focusedIndex =
    focusedKey === null
      ? -1
      : items.findIndex((item) => getKey(item) === focusedKey);
  const getItemKey = useCallback(
    (index: number) => getKey(items[index]),
    [getKey, items],
  );

  const options = {
    count: items.length,
    estimateSize: () => estimateSize,
    getItemKey,
    overscan: 5,
    rangeExtractor: (range: Parameters<typeof defaultRangeExtractor>[0]) => {
      const indexes = defaultRangeExtractor(range);
      return focusedIndex < 0
        ? indexes
        : [...new Set([...indexes, focusedIndex])].sort((a, b) => a - b);
    },
  };

  const elementVirtualizer = useVirtualizer<HTMLUListElement, HTMLLIElement>({
    ...options,
    getScrollElement: () => ref.current,
    enabled: !windowScroll,
  });

  const windowVirtualizer = useWindowVirtualizer<HTMLLIElement>({
    ...options,
    enabled: windowScroll,
    scrollMargin: margin,
  });

  const virtualizer = windowScroll ? windowVirtualizer : elementVirtualizer;
  const setListRef = useCallback(
    (node: HTMLUListElement | null) => {
      ref.current = node;
      if (typeof listRef === 'function') return listRef(node);
      if (listRef) listRef.current = node;
    },
    [listRef],
  );

  return (
    <ul
      {...props}
      style={{ ...props.style, position: 'relative' }}
      ref={setListRef}
    >
      {items.length === 0 ? (
        emptyState != null ? (
          <li className="empty-state">{emptyState}</li>
        ) : null
      ) : (
        <>
          <li
            aria-hidden="true"
            style={{
              height: virtualizer.getTotalSize(),
              listStyle: 'none',
              pointerEvents: 'none',
            }}
          />

          {virtualizer.getVirtualItems().map((row) => (
            <li
              key={row.key}
              data-index={row.index}
              ref={virtualizer.measureElement}
              className={rowClassName}
              aria-setsize={items.length}
              aria-posinset={row.index + 1}
              onFocusCapture={() => setFocusedKey(getKey(items[row.index]))}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setFocusedKey(null);
              }}
              style={
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  minHeight: row.key === retainedItemKey ? row.size : undefined,
                  transform: `translateY(${row.start - margin}px)`,
                } satisfies CSSProperties
              }
            >
              {renderItem(items[row.index], row.index)}
            </li>
          ))}
        </>
      )}
    </ul>
  );
};
