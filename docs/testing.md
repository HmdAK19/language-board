# Testing, Deployment, and Maintenance

[Project overview](../README.md) · [Screenshots](screenshots/README.md)

## Running checks

```bash
npm run build
npm run lint
npm run format:check
npm test
npm run test:e2e
```

Ordinary end-to-end runs do not modify documentation screenshots. Regenerate tracked screenshots explicitly:

```bash
npm run test:docs:screenshots
```

This command runs only `e2e/documentation.spec.ts` with screenshot updates enabled. Parallel or everyday test runs therefore do not unexpectedly modify `docs/screenshots`.

Playwright starts Vite at `http://127.0.0.1:5173` through its `webServer` configuration. Outside CI it may reuse an existing server, so verify that the server on that port belongs to the current checkout. Chromium is the default browser, and traces for failures are stored under test results.

Install Chromium if needed:

```bash
npx playwright install chromium
```

On Windows, use an installed Edge browser with:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:e2e
```

## Coverage

Unit tests cover domain actions, sparse translations, validation, persistence failure recovery, language management, filtering normalization, and versioned dataset transfer.

The filtering suite also asserts referential equality for the blank-query/`all` fast path, protecting the `O(1)` behavior used by virtual lists.

End-to-end tests cover:

- Inline editing, keyword creation, multilingual editing, deletion, and reload persistence.
- Duplicate and invalid values, focus behavior, dialog cancellation, and storage warnings.
- Mouse, touch, and keyboard drag-and-drop.
- Dynamic language creation, ordering, deletion, and sparse translation behavior.
- Search and translated/missing filters while preserving stable keyword identity.
- JSON export/import, invalid input, replacement confirmation, and recovery flows.
- Responsive layouts, routing, public navigation, and documentation screenshots.
- Bounded rendering with 2,000 keywords and 150 languages.
- Dynamic-height virtual rows, scroll retention, and virtualized form value retention.

The last documented full run was performed on 2026-09-24 using Windows, Node.js 22.14, and installed Chrome through Playwright. At that point the build, lint, 19 unit tests, and 47 end-to-end tests all passed. The large-list scenarios covered 2,000 keywords and 150 languages. The public route's shared JavaScript chunk decreased from 21.75 KB to 10.15 KB gzip after replacing route-level barrel imports with direct feature-component imports. Screenshot generation was not rerun because these changes did not alter layout. These counts and measurements describe that verified revision and should be updated when the suite changes.

## Hosting

`npm run build` creates a static Vite application in `dist`. Any static host can serve it, but it must return `index.html` for unknown application routes so direct navigation to `/manage` works.

Because persistence uses browser-local storage, deploying the static files does not create shared user data. Production collaboration, authentication, server backups, and cross-device synchronization require a backend and an asynchronous repository design.

## Maintenance checklist

- Run unit and end-to-end tests after domain, form, route, storage, or drag-and-drop changes.
- Run screenshot generation and visually inspect representative 320/390 and 1440 pixel outputs after layout changes.
- Keep accessible names stable or update tests intentionally when UI language changes.
- Update schema versions and migration/import tests whenever persisted data shape changes.
- Review `localStorage` size and synchronous write behavior before increasing seed or expected dataset size.
- Keep documentation commands aligned with `package.json` scripts and Playwright configuration.
