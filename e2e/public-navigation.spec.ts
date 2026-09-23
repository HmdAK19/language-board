import { expect, test } from '@playwright/test';

import { routePaths } from '../src/app/routes/paths';

for (const width of [1440, 390, 320]) {
  test(`public navigation expands on scroll at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 600 });
    await page.goto(routePaths.public);
    const navigation = page.getByRole('navigation', {
      name: 'Main navigation',
    });
    await expect(
      page.getByRole('heading', { name: 'Word Translations' }),
    ).toBeVisible();
    const initial = await navigation.boundingBox();
    expect(initial).not.toBeNull();
    expect(initial?.width).toBeLessThan(width);

    await page.evaluate(() => window.scrollTo(0, 160));
    await expect(navigation).toHaveAttribute('data-scrolled', 'true');
    await expect
      .poll(async () => {
        const bounds = await navigation.boundingBox();
        return bounds
          ? Math.abs(bounds.width - width) + Math.abs(bounds.y)
          : Infinity;
      })
      .toBeLessThan(1);
    expect((await navigation.boundingBox())?.height).toBe(initial?.height);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(navigation).not.toHaveAttribute('data-scrolled');
    await expect
      .poll(async () => (await navigation.boundingBox())?.width)
      .toBe(initial?.width);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(
      await navigation.evaluate(
        (element) => getComputedStyle(element).transitionProperty,
      ),
    ).toBe('none');
  });
}
