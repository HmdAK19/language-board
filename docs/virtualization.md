# Virtual collections

`VirtualList<T>` in `src/shared/components` handles dynamic row measurement, overscan and focus retention through TanStack Virtual. The internal `useListViewport` hook owns scroll-mode detection and viewport observation. Feature components supply stable item keys, estimated heights and rendering functions; the shared component does not depend on translation state or drag-and-drop.

- Keyword management uses the existing internal desktop scrollbar and window scrolling on mobile. The drag adapter uses virtual droppable mode and a portal clone. `retainedItemKey` reserves the source row's measured height while its content is in the portal.
- Public translations virtualize rows of cards. CSS defines the column count; `useTranslationColumns` observes it and regroups the data when the responsive layout changes. Each row is measured, allowing wrapped text and different translation lengths.
- The language catalog and keyword form virtualize their own scroll containers. React Hook Form retains values when fields unmount (explicitly configured with `shouldUnregister: false`).
- The native language select stays native to preserve browser keyboard navigation and accessibility. Summary metrics have a fixed item count and need no virtualization.

The list must either be its own scroll container (`overflow-y: auto` with a constrained height) or participate in window scrolling. It needs no fixed row height. Stable keys must identify entities rather than their current indexes. Keep row spacing inside the measured wrapper, using padding or a child element.

Five extra rows are rendered on each side of the viewport. The focused item stays mounted when scrolled out of view. List items expose their position and total count to assistive technology. As with other virtual collections, native browser find only searches mounted content.

`e2e/virtualization.spec.ts` covers bounded rendering and end-of-list access with 2,000 keywords on mobile and desktop, form value retention with 150 languages, and keyboard dragging across virtual viewports. Existing translation tests also cover pointer dragging, validation, persistence and responsive layouts.

Keyword rows and translation cards receive language direction from their parent instead of reading translation context independently. Both repeated item types are memoized; keyword actions use stable ID-based callbacks so editing one record does not invalidate every visible row. All functions in these additions use arrow syntax.
