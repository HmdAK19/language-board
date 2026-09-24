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

The `@` alias points to `src`. Barrel `index.ts` files define each area's public exports. Pages are loaded with `React.lazy`, so management-only code and drag-and-drop dependencies are not included in the initial public-page chunk.

## State flow

```text
localStorage -> DatasetRepository.load -> TranslationProvider/useReducer
                                             |
UI -> dispatch(Action) -> datasetReducer -> new Dataset
                                             |
                              DatasetRepository.save -> localStorage
```

The provider loads initial data once and initializes `useReducer`. It exposes the dataset, active language, dispatch function, save state, and warnings through Context. An effect persists each dataset change. Changing only the active language does not modify the dataset. The repository is injectable, so views do not access `localStorage` directly and tests can provide an alternative implementation.

`datasetReducer` delegates keyword and language actions to focused reducers. Reducers are immutable and reject invalid operations by returning the previous state. Yup provides form-level feedback, while domain validation protects state and persistence boundaries.

## Routing

Routes are defined in `src/app/routes/paths.ts`: `/` is public and `/manage` is the management page. Unknown routes redirect to `/` with replacement. `RouteLayout` controls the shell, warnings, and document title. The public route is not a security boundary, and management has no authentication.

## Design decisions

Keywords are stored in the `keywords` map, while `order` stores display order. Stable IDs are therefore independent of position. Translations are sparse, so adding a language does not require rewriting every keyword. The language catalog is part of the dataset, and ordinary languages can be added through the UI without changing code or schema.

Context is simple and appropriate for the current application size. When the provider value changes, however, all consumers are notified. A map does not make every keyword operation constant-time: object copying, uniqueness checks, complete validation, searching, and serialization still grow with the dataset.

## Extending the application

- For a domain feature, add or update its action, reducer, validation, and unit tests before connecting the UI.
- A persisted shape change must be reflected in types, validation, migration/repository logic, import/export, reducers, and tests.
- A backend requires a new repository strategy and a redesign of the current synchronous contract to represent asynchronous loading, saving, and errors.
- Add ordinary languages through **Manage languages**. If default languages change, review seed data and the effect on existing browser data.
- Reusable controls belong in `shared`; translation-specific logic stays in the feature.

## Larger scale

For thousands of keywords, measure typing latency, persistence time, search time, and rendering separately. The current full-dataset validation and synchronous JSON write after every edit are the most immediate risks. Virtualized lists are already in place; likely next steps are selector-based subscriptions, incremental persistence, IndexedDB for an offline version, or a paginated API and indexed database for a networked version.

Debounced persistence also needs explicit pending, flush, failure, and recovery behavior. Multi-user collaboration additionally requires authentication, authorization, conflict versioning, and server-side concurrency rules; none are implemented in the current version.
