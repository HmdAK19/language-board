# User Guide

[Back to project overview](../README.md)

## Reading translations

The `/` route opens **Word Translations**. Select a language from the list. Cards follow the order configured on the management page, and keyword headings are displayed in lowercase. Missing values show `No translation yet`. The interface remains English, while translation text receives the selected language's `lang` and `dir` attributes.

Use the search field to match keyword names and translations in the selected language. The status filter can show all, translated, or missing entries. Search normalization handles case, combining marks, common Persian/Arabic character variants, and zero-width joiners.

## Editing translations

1. Open **Management Page** or navigate to `/manage`.
2. Select the target language.
3. Edit the text beside a keyword. State updates immediately and the dataset is then persisted; there is no separate save button.
4. Open the public page to view the result.

Translations are limited to 500 characters. The reducer trims surrounding whitespace; an empty value removes the language key from the sparse translation map. Editing one language does not alter other translations.

The **Keywords** and **Languages** metrics show dataset totals. **Needs translation** is calculated using the first configured language, which may differ from the currently selected language.

## Adding or editing a keyword

**Add keyword** opens a keyword field and one translation field for every configured language. A keyword name must contain 1–80 characters, and at least one translation must be non-empty. Not every language must be filled. Values are trimmed, and new keywords are appended to the list.

Keyword uniqueness is checked after trimming, NFC normalization, and lowercase conversion, so `Hello` and `hello` are duplicates. The internal ID is independent of the visible name. Validation errors stay in the dialog and can receive focus. Cancel, the close button, Escape, or a backdrop click closes the form without applying changes.

The edit action opens the same multilingual form with existing values. Saving updates the name and translation map while preserving the stable ID and list position.

## Reordering keywords

Drag the handle beside a keyword with a mouse or touch. On touch devices, begin on the handle so page scrolling is not mistaken for reordering. With a keyboard, focus the handle with Tab, press Space, move with arrow keys, and press Space again to drop; Escape cancels.

The order is persisted and shared by all languages and the public page. Reordering is disabled while search or status filters are active because filtered indexes do not represent the full stored order.

## Managing languages

**Manage languages** opens the current language catalog and creation form:

| Field          | Accepted value                                                                                |
| -------------- | --------------------------------------------------------------------------------------------- |
| Language code  | A code accepted by `Intl.getCanonicalLocales`, such as `de` or `pt-BR`; maximum 35 characters |
| Language name  | A display name of 1–80 characters, such as `Deutsch`                                          |
| Text direction | Left to right or right to left                                                                |

Codes are canonicalized; for example, `AR` becomes `ar` and is rejected if Arabic already exists. A successful addition closes the dialog and activates the new language. No automatic translation occurs, so previous keywords are initially empty in that language.

Arrow controls change language order in the selector. The first language becomes the initial choice after reload and is used for the incomplete-translation metric. Language deletion requires browser confirmation and also removes that language's translations; there is no undo. If the active language is removed, the first remaining language becomes active.

## JSON backup and restore

Open **Import & export** on the management page. **Download JSON** creates a version 2 backup containing every language, keyword, translation, and ordering value. Active search and status filters do not restrict the export.

For restore, select a version 2 JSON file up to 20 MB. Review its summary, enable replacement confirmation, and choose **Replace & import**. Imported data replaces rather than merges with the current dataset. A successful import closes the dialog; invalid files and cancelled operations leave current data unchanged. Export a backup before replacement when the current dataset matters.

Processing occurs entirely in the browser. Nothing is sent to a server. If browser storage is unavailable, imported data remains only in the current session and a warning appears.

## Storage and troubleshooting

Browser data is tied to its origin. Changing protocol, hostname, or port uses a different storage area; `localhost` and `127.0.0.1`, for example, do not share data. Clearing site data, changing browser profiles, or using another device does not transfer the dataset.

| Symptom                                    | Meaning and action                                                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| “could not be saved”                       | Changes remain in this session. Check browser storage permissions or capacity before closing the page.               |
| Starter words appear after a read error    | Saved data could not be parsed or validated. The unreadable value is preserved; see the [data model](data-model.md). |
| The language changes after refresh         | Active selection is not persisted; the first configured language is selected.                                        |
| A translation is missing on another device | The application has no backend or shared publishing.                                                                 |
| Directly opening `/manage` returns 404     | Configure the host to fall back to `index.html` for SPA routes.                                                      |

For ordinary backups, use **Download JSON**. If the interface is unavailable, copy `language-board.dataset` from the browser's Local Storage developer tools before attempting manual recovery.
