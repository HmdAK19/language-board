import { expect, test } from '@playwright/test';

import { routePaths } from '../src/app/routes/paths';

test.use({
  hasTouch: true,
  isMobile: true,
  viewport: { width: 390, height: 844 },
});

test('keywords can be reordered with an immediate touch drag', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const rows = Array.from({ length: 4 }, (_, index) => ({
      id: `word-${index}`,
      keyword: `Word ${index}`,
      translations: { en: `Translation ${index}` },
    }));

    localStorage.setItem(
      'language-board.dataset',
      JSON.stringify({
        languages: [{ code: 'en', label: 'English', direction: 'ltr' }],
        keywords: Object.fromEntries(rows.map((row) => [row.id, row])),
        order: rows.map((row) => row.id),
      }),
    );
  });

  await page.goto(routePaths.management);

  const source = page.getByRole('button', { name: 'Reorder Word 0' });
  const destination = page.getByRole('button', { name: 'Reorder Word 2' });
  const sourceBox = await source.boundingBox();
  const destinationBox = await destination.boundingBox();

  if (!sourceBox || !destinationBox) throw new Error('Drag handles missing');

  const client = await page.context().newCDPSession(page);
  const start = {
    x: sourceBox.x + sourceBox.width / 2,
    y: sourceBox.y + sourceBox.height / 2,
  };
  const end = {
    x: destinationBox.x + destinationBox.width / 2,
    y: destinationBox.y + destinationBox.height + 40,
  };

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [start],
  });
  await page.waitForTimeout(30);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: end.x, y: (start.y + end.y) / 2 }],
  });
  await page.waitForTimeout(100);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [end],
  });
  await page.waitForTimeout(100);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });

  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = localStorage.getItem('language-board.dataset');
        return raw ? (JSON.parse(raw).order as string[]) : [];
      }),
    )
    .toEqual(['word-1', 'word-2', 'word-3', 'word-0']);
});
