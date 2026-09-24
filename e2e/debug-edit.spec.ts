import { test } from '@playwright/test';

test('debug edit', async ({ page }) => {
  page.on('pageerror', error => console.log('PAGEERROR', error.stack));
  await page.goto('/manage');
  await page.getByRole('button', { name: /Edit all translations for Hello/ }).click();
  await page.waitForTimeout(500);
});
