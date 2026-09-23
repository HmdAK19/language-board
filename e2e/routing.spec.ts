import { expect, test } from '@playwright/test';

import { routePaths } from '../src/app/routes/paths';

test('unknown URLs redirect to public without mounting the admin navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (
            node instanceof Element &&
            (node.matches('.is-admin-nav') ||
              node.querySelector('.is-admin-nav'))
          ) {
            sessionStorage.setItem('admin-navigation-mounted', 'true');
          }
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });

  await page.goto('/unknown-route');
  await expect(page).toHaveURL(routePaths.public);
  await expect(
    page.getByRole('heading', { name: 'Word Translations', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem('admin-navigation-mounted'),
    ),
  ).toBeNull();

  await page.getByRole('link', { name: 'Management Page' }).click();
  await expect(page).toHaveURL(routePaths.management);
  await expect(page.locator('.is-admin-nav')).toBeVisible();
});
