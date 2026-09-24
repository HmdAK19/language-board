# Components

[Project overview](../README.md) · [Architecture](architecture.md) · [Styles](styles.md)

## Application composition

| Component             | Responsibility                                                    |
| --------------------- | ----------------------------------------------------------------- |
| `App`                 | Mount providers and application routes                            |
| `TranslationProvider` | Load data, own reducer state, persist changes, and expose Context |
| `RouteLayout`         | Render shell, warning feedback, navigation, and route outlet      |
| `AppShell`            | Shared page frame and footer                                      |
| `AppNavigation`       | Route-aware navigation actions                                    |
| `ManagementPage`      | Compose metrics, filters, editable list, and management dialogs   |
| `PublicPage`          | Compose language selection, filters, and read-only translations   |

## Shared components

- `Button` provides primary and secondary variants while preserving standard button attributes. Its default type prevents accidental form submission.
- `PageHeading` renders a title, optional eyebrow, and action area with consistent heading IDs.
- `TextField` associates labels, IDs, errors, `aria-invalid`, and React 19-compatible refs.
- `Modal` wraps the native dialog API, connects title and description, supports Escape/backdrop/button closing, and restores previous focus on unmount.
- `VirtualList` centralizes TanStack Virtual behavior for window or element scrolling, dynamic measurement, overscan, stable keys, and focused-item retention.

`TextField` marks requested initial focus with `data-autofocus`; `Modal` focuses that field after `showModal`. This ordering remains reliable when Strict Mode reruns effects. Shared components do not import translation Context or persistence services.

## Translation feature components

| Group              | Responsibility                                                                        |
| ------------------ | ------------------------------------------------------------------------------------- |
| `keywords`         | Virtualized editable list, drag-and-drop rows, and add/edit forms                     |
| `translations`     | Responsive card rows and directional translation display                              |
| `languages`        | Active-language selection, virtualized catalog, creation, ordering, and deletion      |
| `management`       | Dataset metrics and dialog launch actions                                             |
| `dataset-transfer` | Import/export dialog, file summary, validation feedback, and replacement confirmation |
| `KeywordFilters`   | Search and translation-status filtering without mutating stored order                 |
| `ActionIcon`       | Shared feature-level icons for edit, delete, and reorder controls                     |

Rows and translation cards receive language direction from their parent rather than reading Context independently. Repeated items are memoized, and keyword rows receive stable ID-based callbacks. Editing one translation therefore avoids rerendering unchanged visible items in the virtual list.

## Forms

React Hook Form uses `yupResolver` with schemas in `features/translations/schemas`. Form value types are inferred from Yup. The keyword form creates one translation input for each configured language and validates the “at least one translation” rule at object level. The language form reuses domain validation to detect duplicate or invalid codes.

Virtualized form fields use `shouldUnregister: false`, so values remain in form state while fields are outside the rendered viewport. Forms do not perform persistence directly; dialog callbacks dispatch domain actions.

## Data transfer

`DatasetTransferDialog` creates a version 2 export from the complete dataset and validates imported files at the service boundary before dispatch. Replacement is enabled only after a valid file is selected and the user explicitly confirms complete replacement. Successful import closes the dialog.

Export, import, summary, and section-heading components are separated under `dataset-transfer` so orchestration stays cohesive without creating one oversized component.

## Development rules

Shared code must not depend on feature or storage modules. State operations belong in `domain`, form shape and messages belong in `schemas`, and persistence belongs behind `services`. Feature-specific styles live beside their owner as `.module.scss` files.

Barrel `index.ts` files define stable public APIs across feature or application boundaries. Code inside the translation feature may use direct component imports at lazy-route boundaries. This intentional exception prevents unrelated management dependencies from entering the public-page chunk and makes route-level code splitting visible in the source.

Add further memoization or split Context only after measurement identifies a real update problem; both techniques create maintenance costs and should have a specific performance goal. The current row/card memoization targets measured high-frequency list updates only.
