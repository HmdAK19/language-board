# Application Screenshot Gallery

[Project overview](../../README.md) · [User guide](../user-guide.md)

These screenshots are captured from the real application using seed data, the Persian translation language, and isolated Playwright storage. They are not reconstructed mockups and do not contain personal browser information.

## Mobile views

| Management, 390 px                        | Public, 390 px                        |
| ----------------------------------------- | ------------------------------------- |
| ![Mobile management page](manage-390.png) | ![Mobile public page](public-390.png) |

| Add keyword, 390 px                               | Manage languages, 390 px                                |
| ------------------------------------------------- | ------------------------------------------------------- |
| ![Mobile add-keyword dialog](add-keyword-390.png) | ![Mobile language-management dialog](languages-390.png) |

## Desktop views

![Desktop management page](manage-1440.png)

![Desktop public page](public-1440.png)

![Add keyword with fields for all languages](add-keyword-1440.png)

![Manage existing languages and add another](languages-1440.png)

## All captured sizes

| Viewport width | Management               | Public                   | Add keyword                   | Languages                   |
| -------------- | ------------------------ | ------------------------ | ----------------------------- | --------------------------- |
| 320 px         | [Image](manage-320.png)  | [Image](public-320.png)  | [Image](add-keyword-320.png)  | [Image](languages-320.png)  |
| 390 px         | [Image](manage-390.png)  | [Image](public-390.png)  | [Image](add-keyword-390.png)  | [Image](languages-390.png)  |
| 768 px         | [Image](manage-768.png)  | [Image](public-768.png)  | [Image](add-keyword-768.png)  | [Image](languages-768.png)  |
| 1024 px        | [Image](manage-1024.png) | [Image](public-1024.png) | —                             | —                           |
| 1440 px        | [Image](manage-1440.png) | [Image](public-1440.png) | [Image](add-keyword-1440.png) | [Image](languages-1440.png) |
| 1920 px        | [Image](manage-1920.png) | [Image](public-1920.png) | —                             | —                           |

## Reproducing screenshots

```bash
npm run test:docs:screenshots
```

On Windows with installed Edge:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:docs:screenshots
```

Playwright starts the development server. Every viewport receives a fresh browser context, so personal data is not touched. Capture waits for main content and fonts, uses a 900-pixel viewport height, enables reduced motion, and disables animation during capture. Pages use full-page screenshots, while dialogs stay viewport-sized so their fixed backdrop renders correctly.

The last documented capture was generated on 2026-09-24 with Edge on Windows. All six scenarios passed and produced 20 PNG files: 12 page images and eight dialog images. Re-running the command overwrites those files. The scenarios also check for horizontal document overflow; after capture, visually inspect at least the 320/390 and 1440 pixel views and both dialogs.
