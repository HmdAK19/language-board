# Data Model and Persistence

[Project overview](../README.md) · [Architecture](architecture.md)

## Dataset

The runtime dataset has this shape:

```json
{
  "languages": [{ "code": "fa", "label": "Persian", "direction": "rtl" }],
  "keywords": {
    "word-1": {
      "id": "word-1",
      "keyword": "Hello",
      "translations": { "fa": "سلام" }
    }
  },
  "order": ["word-1"]
}
```

`keywords` is a map for direct ID lookup, and `order` contains only display order. Each ID must map to exactly one record with the same `id`. Duplicate and unsafe identifiers such as `__proto__`, `constructor`, and `prototype` are rejected. Keyword names must be unique after trimming, NFC normalization, and lowercase conversion.

`languages` may be empty. Every language code must be canonical and unique, its label must be non-empty, and direction must be `rtl` or `ltr`. Removing a language removes its translations from all keywords. Removing every language leaves every keyword with an empty translation map.

`translations` has the TypeScript type `Partial<Record<Language, string>>`. A missing key means that the keyword has not been translated into that language. Every translation key must refer to a configured language. Keyword and language labels are limited to 80 characters; translations are limited to 500 characters.

## Reducer operations

| Operation                           | Effect                                                 |
| ----------------------------------- | ------------------------------------------------------ |
| `edit`                              | Set or remove one translation for one keyword          |
| `add`                               | Add a keyword and one or more translations             |
| `updateKeyword`                     | Update a keyword name and its translation map          |
| `deleteKeyword` / `clearKeywords`   | Remove one or all keywords                             |
| `move`                              | Change keyword order without changing IDs              |
| `addLanguage`                       | Append a validated language without rewriting keywords |
| `removeLanguage` / `clearLanguages` | Remove language definitions and their translations     |
| `moveLanguage`                      | Change language order                                  |
| `replaceDataset`                    | Replace the complete dataset after validated import    |

Reducers return the original state when an operation is invalid or would not change data. Edits preserve translations for all other languages.

## Browser persistence

The repository contract is synchronous:

```ts
load(): { data: Dataset; warning: string };
save(data: Dataset): void;
```

The `localStorage` key is `language-board.dataset`. If no saved value exists, the seed dataset is created and saved. After each dataset change, the provider validates and serializes the complete dataset.

If stored JSON cannot be parsed or validated, the application displays seed data and a warning. The unreadable value is preserved rather than overwritten automatically. This gives the user an opportunity to recover it manually. If a later write fails because storage is unavailable or full, changes remain in memory for the current session and a warning is shown.

Browser storage is origin-specific. Protocol, hostname, and port changes create a different storage area; for example, `localhost` and `127.0.0.1` do not share data.

## Import and export

External backups use a versioned envelope rather than exposing an unversioned raw dataset. Version 2 preserves Unicode, sparse translations, keyword order, and language order. Import rejects unsupported versions, unsafe IDs, duplicate names or codes, unknown translation languages, invalid directions, oversized values, and files larger than 20 MB.

Import is an atomic replacement. Validation completes before dispatch, and invalid or cancelled input does not mutate current state. Export always includes the entire dataset, independently of active search and status filters.

## Complexity notes

Direct keyword lookup is `O(1)` on average, while uniqueness checks, deletion from order, language removal, validation, filtering, and serialization require traversal. Sparse translation maps avoid allocating `K × L` empty values, but a fully translated dataset naturally grows toward that size.
