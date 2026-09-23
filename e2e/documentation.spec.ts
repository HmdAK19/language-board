import { expect, test } from '@playwright/test';
import { routePaths } from '../src/app/routes/paths';

// Fresh Playwright contexts keep documentation independent of personal data.
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`documentation screenshots at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const capture = async (name: string) => {
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `docs/screenshots/${name}-${width}.png`,
        fullPage: name === 'manage' || name === 'public',
        animations: 'disabled',
      });
    };
    await page.goto(routePaths.management);
    await expect(
      page.getByRole('heading', {
        name: 'Translation Management',
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Hello translation', exact: true }),
    ).toHaveValue('سلام');
    await capture('manage');
    if ([320, 390, 768, 1440].includes(width)) {
      await page
        .getByRole('button', { name: 'Add Keyword', exact: true })
        .click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByLabel('Keyword', { exact: true })).toBeFocused();
      await capture('add-keyword');
      await page.keyboard.press('Escape');
      await page
        .getByRole('button', { name: 'Manage languages', exact: true })
        .click();
      await expect(page.getByLabel('Language code')).toBeFocused();
      await capture('languages');
      await page.keyboard.press('Escape');
    }
    await page.goto(routePaths.public);
    await expect(
      page.getByRole('heading', { name: 'Word Translations', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('No translation yet', { exact: true }),
    ).toHaveCount(2);
    await capture('public');
  });
}
