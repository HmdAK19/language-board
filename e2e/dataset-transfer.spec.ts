import { test, expect } from '@playwright/test';

const imported = {
  version: 2,
  languages: [{ code: 'de', label: 'Deutsch', direction: 'ltr' }],
  keywords: {
    order: ['imported-word'],
    byId: {
      'imported-word': {
        id: 'imported-word',
        keyword: 'Welcome',
        translations: { de: 'Willkommen' },
      },
    },
  },
};

const upload = {
  name: 'workspace.json',
  mimeType: 'application/json',
  buffer: Buffer.from(JSON.stringify(imported)),
};

test('JSON export includes all data and can be restored after replacement', async ({
  page,
}) => {
  await page.goto('/manage');
  await page.getByRole('searchbox').fill('hello');
  await page.getByRole('button', { name: 'Import & export' }).click();

  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  const download = await downloading;
  const path = await download.path();

  expect(path).toBeTruthy();

  await page.getByLabel('Choose JSON file').setInputFiles(upload);
  await expect(
    page.getByText('workspace.json is ready to import.'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Replace & import' }),
  ).toBeDisabled();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Replace & import' }).click();
  await expect(
    page.getByText('Workspace imported and saved in this browser.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Clear filters' }).click();

  await expect(
    page.getByRole('textbox', { name: 'Welcome translation' }),
  ).toHaveValue('Willkommen');
  await expect(page.getByRole('combobox')).toHaveValue('de');
  await page.reload();
  await expect(
    page.getByRole('textbox', { name: 'Welcome translation' }),
  ).toHaveValue('Willkommen');

  await page.getByRole('button', { name: 'Import & export' }).click();
  if (!path) throw new Error('Download missing');
  await page.getByLabel('Choose JSON file').setInputFiles(path);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Replace & import' }).click();
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  await expect(page.getByRole('status')).toHaveText('8 of 8 keywords');
  await expect(
    page.getByRole('textbox', { name: 'Hello translation', exact: true }),
  ).toHaveValue('سلام');
});

test('invalid files and cancelling preview leave the workspace intact', async ({
  page,
}) => {
  await page.goto('/manage');
  await page.getByRole('button', { name: 'Import & export' }).click();
  await page.getByLabel('Choose JSON file').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{'),
  });
  await expect(page.getByRole('alert')).toContainText('not valid JSON');
  await expect(
    page.getByRole('button', { name: 'Replace & import' }),
  ).toBeDisabled();

  await page.getByLabel('Choose JSON file').setInputFiles(upload);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();

  await expect(page.getByRole('status')).toHaveText('8 of 8 keywords');
  await expect(
    page.getByRole('button', { name: 'Import & export' }),
  ).toBeFocused();
  await page.reload();
  await expect(page.getByRole('status')).toHaveText('8 of 8 keywords');
});

for (const width of [320, 768, 1024, 1440]) {
  test(`transfer dialog fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/manage');
    await page.getByRole('button', { name: 'Import & export' }).click();
    await page.getByLabel('Choose JSON file').setInputFiles(upload);
    await expect(page.getByRole('checkbox')).toBeVisible();

    const dialog = page.getByRole('dialog');

    expect(
      await dialog.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);

    await page.screenshot({
      path: `test-results/transfer-${width}.png`,
      fullPage: false,
    });

    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Replace & import' }).click();
    await expect(
      page.getByText('Workspace imported and saved in this browser.'),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
}

test('a later file selection supersedes an unfinished read', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const read = File.prototype.text;
    File.prototype.text = async function () {
      if (this.name === 'slow.json')
        await new Promise((resolve) => setTimeout(resolve, 800));

      return read.call(this);
    };
  });

  await page.goto('/manage');
  await page.getByRole('button', { name: 'Import & export' }).click();
  await page
    .getByLabel('Choose JSON file')
    .setInputFiles({ ...upload, name: 'slow.json' });
  await page
    .getByLabel('Choose JSON file')
    .setInputFiles({ ...upload, name: 'latest.json' });

  await expect(page.getByText('latest.json is ready to import.')).toBeVisible();
  await page.waitForTimeout(1000);

  await expect(page.getByText('latest.json is ready to import.')).toBeVisible();
});

test('import remains usable and reports unavailable browser storage', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Storage unavailable');
    };
  });

  await page.goto('/manage');
  await page.getByRole('button', { name: 'Import & export' }).click();
  await page.getByLabel('Choose JSON file').setInputFiles(upload);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Replace & import' }).click();
  await expect(
    page.getByText(
      'Workspace imported for this session. Browser storage is unavailable; export a backup before closing.',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(
    page.getByRole('textbox', { name: 'Welcome translation' }),
  ).toHaveValue('Willkommen');
});
