import { expect, test } from '@playwright/test';

import { routePaths } from '../src/app/routes/paths';

test('editing all keyword translations persists after reload', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(routePaths.management);
  await page
    .getByRole('button', {
      name: 'Edit all translations for Hello',
      exact: true,
    })
    .click();

  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('heading', { name: 'Edit keyword · Hello' }),
  ).toBeVisible();

  await dialog.getByLabel('Keyword', { exact: true }).fill('Greeting');
  await dialog.getByLabel('Translation · فارسی', { exact: true }).fill('درود');
  await dialog.getByRole('button', { name: 'Save keyword' }).click();

  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole('textbox', { name: 'Greeting translation' }),
  ).toHaveValue('درود');

  await page.reload();
  await expect(
    page.getByRole('textbox', { name: 'Greeting translation' }),
  ).toHaveValue('درود');
  expect(pageErrors).toEqual([]);
});
