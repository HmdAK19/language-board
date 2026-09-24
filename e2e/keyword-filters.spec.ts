import { test, expect } from '@playwright/test';

test('search, status, editing and clearing preserve keyword identity', async ({
  page,
}) => {
  await page.goto('/manage');

  const search = page.getByRole('searchbox', { name: 'Search keywords' });

  await search.fill(' WORLD ');
  await expect(page.getByRole('status')).toHaveText('1 of 8 keywords');
  await expect(
    page.getByRole('button', { name: 'Reorder World', exact: true }),
  ).toBeDisabled();

  await page
    .getByRole('textbox', { name: 'World translation', exact: true })
    .fill('زمین');

  await search.fill('زمین');
  await expect(
    page.getByRole('textbox', { name: 'World translation', exact: true }),
  ).toBeVisible();

  await search.fill('no-such-word');
  await expect(
    page.getByText(
      'No matching keywords. Try another search or clear filters.',
    ),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('button', { name: 'Missing', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('2 of 8 keywords');

  await page.getByRole('combobox').selectOption('fr');
  await expect(page.getByRole('status')).toHaveText('0 of 8 keywords');

  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(
    page.getByRole('button', { name: 'Reorder World', exact: true }),
  ).toBeEnabled();

  await page.getByRole('link', { name: 'Public Page' }).click();
  await search.fill('BONJOUR');
  await expect(page.getByRole('status')).toHaveText('1 of 8 keywords');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('hello');
});

for (const width of [320, 768, 1024, 1440]) {
  test(`filters fit viewport ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const path of ['/manage', '/']) {
      await page.goto(path);
      await expect(page.getByRole('searchbox')).toBeVisible();

      await page.getByRole('searchbox').fill('book');
      await expect(page.getByRole('status')).toHaveText('1 of 8 keywords');

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  });
}
