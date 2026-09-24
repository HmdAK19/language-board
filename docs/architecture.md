# Architecture and Development

[Project overview](../README.md) · [Data model](data-model.md) · [Components](components.md)

## Structure

```text
src/
  app/
    layout/       AppShell, AppNavigation, and scroll behavior
    providers/    TranslationProvider and repository integration
    routes/       route configuration, RouteLayout, and lazy loading
    styles/       global and shell styles
  features/translations/
    components/
      dataset-transfer/   JSON import and export
      keywords/           keyword list, row, and forms
      languages/          language selection and management
      management/         management metrics and actions
      translations/       translation list and cards
    domain/       reducers, factories, seed data, validation, and migration
    hooks/        controlled access to Context and UI behavior
    pages/        ManagementPage and PublicPage
    schemas/      Yup schemas and form types
    services/     DatasetRepository contract and localStorage adapter
    store/        Context contract
    types/        Dataset, Keyword, LanguageDefinition, and Action
  shared/
    components/   reusable controls and VirtualList
    hooks/        shared viewport behavior
    styles/       tokens, reset, mixins, and shared rules
  test/           domain and repository unit tests
e2e/              browser tests and screenshot generation
```

The `@` alias points to `src`. Barrel `index.ts` files define each area's public API for consumers outside that area. Route components intentionally use direct imports for their feature components: this keeps the dependency graph explicit at lazy-route boundaries and prevents management-only code, including drag-and-drop, from being promoted into a chunk required by the public page.

## State flow

```text
localStorage -> DatasetRepository.load -> TranslationProvider/useReducer
                                             |
UI -> dispatch(Action) -> datasetReducer -> new Dataset
                                             |
                              DatasetRepository.save -> localStorage
```

The provider loads initial data once and initializes `useReducer`. It exposes the dataset, active language, dispatch function, save state, and warnings through Context. Persistence follows a deferred copy of the dataset so urgent input rendering completes before full validation, serialization, and the synchronous `localStorage` write. Rapid edits can therefore be coalesced by React. A `pagehide` handler flushes the latest in-memory dataset before the page is discarded. Changing only the active language does not modify the dataset. The repository is injectable, so views do not access `localStorage` directly and tests can provide an alternative implementation.

`datasetReducer` delegates keyword and language actions to focused reducers. Reducers are immutable and reject invalid operations by returning the previous state. Yup provides form-level feedback, while domain validation protects state and persistence boundaries.

## Routing

Routes are defined in `src/app/routes/paths.ts`: `/` is public and `/manage` is the management page. Unknown routes redirect to `/` with replacement. `RouteLayout` controls the shell, warnings, and document title. The public route is not a security boundary, and management has no authentication.

## Design decisions

Keywords are stored in the `keywords` map, while `order` stores display order. Stable IDs are therefore independent of position. Translations are sparse, so adding a language does not require rewriting every keyword. The language catalog is part of the dataset, and ordinary languages can be added through the UI without changing code or schema.

Context is simple and appropriate for the current application size. When the provider value changes, however, all consumers are notified. A map does not make every keyword operation constant-time: object copying, uniqueness checks, complete validation, searching, and serialization still grow with the dataset.

Visible keyword rows and public translation cards are memoized. Their parents pass stable callbacks and derived language direction explicitly, so unchanged rows do not subscribe to Context or rerender when another keyword is edited. This optimization is deliberately limited to repeated list items rather than applied indiscriminately across the component tree.

The unfiltered keyword path returns the existing `order` array directly. It does not scan records or normalize Unicode text until a search term or translation-status filter requires that work.

## Extending the application

- For a domain feature, add or update its action, reducer, validation, and unit tests before connecting the UI.
- A persisted shape change must be reflected in types, validation, migration/repository logic, import/export, reducers, and tests.
- A backend requires a new repository strategy and a redesign of the current synchronous contract to represent asynchronous loading, saving, and errors.
- Add ordinary languages through **Manage languages**. If default languages change, review seed data and the effect on existing browser data.
- Reusable controls belong in `shared`; translation-specific logic stays in the feature.

## Larger scale

For thousands of keywords, measure typing latency, persistence time, search time, and rendering separately. Virtualization, memoized repeated items, an `O(1)` unfiltered path, and deferred persistence reduce the current hot-path cost. Full-dataset validation, serialization, and synchronous `localStorage` writing still scale with dataset size even though they no longer run in the urgent render path. Likely next steps are selector-based subscriptions, incremental persistence, IndexedDB for an offline version, or a paginated API and indexed database for a networked version.

Any future debounced or asynchronous persistence strategy also needs explicit pending, flush, failure, and recovery behavior. Multi-user collaboration additionally requires authentication, authorization, conflict versioning, and server-side concurrency rules; none are implemented in the current version.
