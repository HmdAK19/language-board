# Language Board

A responsive keyword and translation workspace built with React and TypeScript. It provides a read-only translation page, inline editing, multilingual keyword creation, language management, and JSON import/export. Data is stored in the browser; the current application has no backend.

## Quick start

Node.js 22.12 or newer and npm are required. The documented environment uses Node.js 22.14 on Windows.

```bash
npm ci
npm run dev
```

Public page: <http://127.0.0.1:5173/>

Management page: <http://127.0.0.1:5173/manage>

The `/` route is the public page. Unknown routes, including the former `/public` route, redirect to `/`. The interface remains in English; selecting a language changes the displayed translations and their text direction.

## Current UI

### Translation management

![Translation management at 1440 pixels](docs/screenshots/manage-1440.png)

### Public page

![Public translation page at 1440 pixels](docs/screenshots/public-1440.png)

### Keyword and language management

![Adding a keyword with multilingual translations](docs/screenshots/add-keyword-1440.png)

![Language management dialog](docs/screenshots/languages-1440.png)

See the [screenshot gallery](docs/screenshots/README.md) for mobile layouts, all captured sizes, and reproduction instructions.

## Navigation and access model

The application does not currently provide authentication or role-based access control. For that reason, the public page includes a button that navigates directly to the management panel, and the management panel includes a button that returns to the public page. These controls are navigation conveniences only; they do not represent protected routes or separate user permissions.

## Features

- Starts with eight keywords and Persian, Arabic, and French. The Persian translations for `Key` and `Food` are intentionally empty.
- Inline translation editing with automatic persistence to `localStorage`.
- Keyword creation with one field per language and at least one required translation.
- Mouse, touch, and keyboard drag-and-drop with one shared order across languages.
- Dynamic language creation using a canonical language code, display name, and text direction.
- Language reordering and deletion, including removal of the deleted language's translations.
- A read-only public view that shows `No translation yet` for missing translations.
- Search and translated/missing status filters in both public and management views.
- Native dialogs, focus restoration, accessible validation feedback, and reduced-motion support.
- Versioned JSON backup and restore with schema validation.
- Virtualized keyword, translation, language, and multilingual form lists.

## JSON import and export

Open **Import & export** on the management page. **Download JSON** exports every language, keyword, translation, and ordering value, regardless of the active filters. The exported file uses dataset format version 2.

To restore data, select a version 2 JSON file no larger than 20 MB. After validation, the dialog shows its language and keyword counts. Enable the replacement confirmation and select **Replace & import**. Import replaces the complete dataset; it does not merge records. Invalid files and cancelled operations leave the current dataset unchanged.

Files are processed entirely in the browser and are not uploaded. If browser storage is unavailable, imported data remains available only for the current session and the application displays a warning.

## Design and scaling questions

### 1. Why did you choose this data structure for keywords and translations, and how does it hold up when a new language is added?

The dataset uses a normalized structure:

```ts
{
  languages: LanguageDefinition[];
  keywords: Record<string, Keyword>;
  order: string[];
}
```

Each keyword has a stable ID and stores translations in a sparse map:

```ts
translations: Partial<Record<Language, string>>;
```

`keywords[id]` provides direct lookup, while the separate `order` array allows reordering without changing keyword identity or moving complete records. This is useful for editing, deletion, drag-and-drop, and stable React keys.

The translation map contains only translations that exist. Adding a language therefore appends one definition to `languages`; it does not rewrite every keyword or create empty translation fields. Existing keywords simply return an empty value until a translation is entered. Adding a language is approximately `O(L)` because the language list is validated and copied, rather than `O(K × L)`. Deleting a language is `O(K)` because that language's translation must be removed from every keyword.

### 2. How would you scale this application to thousands of keywords and many languages? What would become the first bottleneck?

The interface already virtualizes long lists, so it creates DOM nodes only for visible rows. Rendering thousands of list items is therefore unlikely to be the first bottleneck.

The first bottleneck would most likely be persistence and global state updates. Every input change still copies the `keywords` object and updates shared Context, but repeated rows/cards are memoized and persistence follows a deferred dataset so urgent input rendering is not blocked by validation, `JSON.stringify`, and the synchronous `localStorage` write. The latest pending state is flushed when the page is discarded. With thousands of keywords and many populated translations, complete-dataset processing can still consume main-thread time and eventually reach browser storage limits.

For a larger system, the next steps would be:

- Store languages, keywords, and translations in separate backend database tables.
- Load keywords using cursor-based pagination instead of loading the complete dataset.
- Persist only the changed translation, with debounced or blur-triggered writes and optimistic UI updates.
- Index normalized keyword text and `(keywordId, languageCode)` in the database.
- Move large-scale search and filtering to the server.
- Split the Context or use selector-based subscriptions so unrelated components do not update after every edit.
- Retain list virtualization.
- For an offline-only application, replace `localStorage` with IndexedDB and move expensive processing to a Web Worker.

Search is a secondary bottleneck. A blank query with the `all` status now returns the existing ordered IDs in `O(1)`, and status-only filtering avoids text normalization. Active text search still scans and normalizes candidate keywords; cached normalized text, a client-side search index, or server-side search would address larger datasets.

In short, the sparse translation model and current render optimizations handle the existing workload well, but full-dataset validation, serialization, and persistence remain the first serious scaling limits.

## Documentation

| Document                                  | Contents                                                              |
| ----------------------------------------- | --------------------------------------------------------------------- |
| [User guide](docs/user-guide.md)          | Workflows, input rules, language management, and troubleshooting      |
| [Architecture](docs/architecture.md)      | Project structure, state flow, design decisions, and extension points |
| [Data model](docs/data-model.md)          | Dataset schema, reducer operations, validation, and persistence       |
| [Components](docs/components.md)          | Component responsibilities, forms, Context, and boundaries            |
| [Styles](docs/styles.md)                  | CSS Modules, tokens, responsive breakpoints, and conventions          |
| [Testing and deployment](docs/testing.md) | Commands, verification results, hosting, and maintenance              |
| [Virtualization](docs/virtualization.md)  | Virtual-list behavior and test coverage                               |
| [Screenshots](docs/screenshots/README.md) | Desktop/mobile gallery and capture instructions                       |

## Project commands

| Command                         | Purpose                                             |
| ------------------------------- | --------------------------------------------------- |
| `npm run dev`                   | Start the loopback development server               |
| `npm run build`                 | Type-check and create the Vite production build     |
| `npm run preview`               | Preview the production build, normally on port 4173 |
| `npm run lint`                  | Run ESLint                                          |
| `npm test`                      | Run domain and repository unit tests                |
| `npm run test:e2e`              | Run the Playwright suite                            |
| `npm run test:docs:screenshots` | Regenerate tracked documentation screenshots        |
| `npm run format:check`          | Check formatting                                    |
| `npm run format`                | Format project files                                |

Install Chromium before running Playwright:

```bash
npx playwright install chromium
```

On Windows, the installed Edge browser can be used instead:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:e2e
```

## Technology and scope

The project uses React 19, TypeScript, Vite, React Router, Context and reducers, Sass, React Hook Form, Yup, TanStack Virtual, and `@hello-pangea/dnd`. Vitest and Playwright provide automated coverage. Exact dependency versions are recorded in `package-lock.json`; Inter and Vazirmatn are bundled locally.

“Public” means a read-only presentation of the same local browser dataset. The application has no authentication, server publishing, cross-device synchronization, or multi-user permissions. The active language survives in-app navigation but resets to the first configured language after reload. Multiple tabs hold independent snapshots, and the last write wins.
