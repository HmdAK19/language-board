import { test, expect, type Page, type Locator } from '@playwright/test';
import { routePaths } from '../src/app/routes/paths';

const seed = async (page: Page, keywordCount = 2000, languageCount = 1) => {
  await page.addInitScript(
    ({ keywordCount, languageCount }) => {
      if (localStorage.getItem('language-board.dataset')) return;
      const languages = Array.from({ length: languageCount }, (_, index) => ({
        code: index === 0 ? 'fa' : `en-x-l${index}`,
        label: `Language ${index}`,
        direction: index === 0 ? 'rtl' : 'ltr',
      }));
      const rows = Array.from({ length: keywordCount }, (_, index) => ({
        id: `word-${index}`,
        keyword: `Word ${index}`,
        translations: { fa: `Translation ${index}` },
      }));
      localStorage.setItem(
        'language-board.dataset',
        JSON.stringify({
          languages,
          keywords: Object.fromEntries(rows.map((row) => [row.id, row])),
          order: rows.map((row) => row.id),
        }),
      );
    },
    { keywordCount, languageCount },
  );
};

const scrollToEnd = async (list: Locator, windowScroll = false) => {
  await list.evaluate((element, usesWindow) => {
    if (usesWindow) window.scrollTo(0, document.documentElement.scrollHeight);
    else element.scrollTop = element.scrollHeight;
  }, windowScroll);
};

for (const width of [390, 1440]) {
  test(`large keyword and card lists remain bounded at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await seed(page);

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(routePaths.management);
    const list = page.getByRole('list', { name: 'Keywords', exact: true });
    const first = page.getByRole('textbox', {
      name: 'Word 0 translation',
      exact: true,
    });

    await first.fill('Edited value');
    await first.blur();

    expect(await list.getByRole('textbox').count()).toBeLessThan(40);
    await expect(async () => {
      await scrollToEnd(list, width < 768);
      await expect(
        page.getByRole('textbox', {
          name: 'Word 1999 translation',
          exact: true,
        }),
      ).toBeVisible();
    }).toPass();

    expect(await list.getByRole('textbox').count()).toBeLessThan(40);
    await page.reload();
    await expect(first).toHaveValue('Edited value');

    await page.goto(routePaths.public);
    const cards = page.getByRole('list', { name: 'Translations', exact: true });
    await expect(
      page.getByRole('heading', { name: 'word 0', exact: true }),
    ).toBeVisible();
    expect(await page.getByRole('heading', { level: 2 }).count()).toBeLessThan(
      80,
    );

    await expect(async () => {
      await scrollToEnd(cards, true);
      await expect(
        page.getByRole('heading', { name: 'word 1999', exact: true }),
      ).toBeVisible();
    }).toPass();
    expect(await page.getByRole('heading', { level: 2 }).count()).toBeLessThan(
      80,
    );

    expect(errors).toEqual([]);
  });
}

test('large language catalog and form retain values across unmounts', async ({
  page,
}) => {
  await seed(page, 5, 150);
  await page.goto(routePaths.management);

  await page
    .getByRole('button', { name: 'Manage languages', exact: true })
    .click();
  const catalog = page.getByRole('list', {
    name: 'Available languages',
    exact: true,
  });

  expect(await catalog.getByRole('button').count()).toBeLessThan(60);
  await expect(async () => {
    await scrollToEnd(catalog);
    await expect(
      catalog.getByRole('button', { name: 'Delete Language 149', exact: true }),
    ).toBeVisible();
  }).toPass();

  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Add Keyword', exact: true }).click();

  await page.getByLabel('Keyword', { exact: true }).fill('Added');
  await page
    .getByLabel('Translation · Language 0', { exact: true })
    .fill('Saved at start');
  await page.getByLabel('Translation · Language 0', { exact: true }).blur();
  const fields = page.getByRole('list', {
    name: 'Translation fields',
    exact: true,
  });

  await expect(async () => {
    await scrollToEnd(fields);
    await expect(
      page.getByLabel('Translation · Language 149', { exact: true }),
    ).toBeVisible();
  }).toPass();
  expect(await fields.getByRole('textbox').count()).toBeLessThan(25);

  await page
    .getByLabel('Translation · Language 149', { exact: true })
    .fill('Saved at end');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Add keyword', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await expect(
    page.getByRole('textbox', { name: 'Added translation' }),
  ).toHaveValue('Saved at start');
  await page.getByRole('combobox').selectOption('en-x-l149');
  await expect(
    page.getByRole('textbox', { name: 'Added translation' }),
  ).toHaveValue('Saved at end');
});

test('switching languages preserves the keyword list scroll position', async ({
  page,
}) => {
  await seed(page, 2000, 2);
  await page.goto(routePaths.management);

  const list = page.getByRole('list', { name: 'Keywords', exact: true });
  await list.evaluate((element) => {
    element.scrollTop = 3200;
  });
  const scrollTop = await list.evaluate((element) => element.scrollTop);

  await page.getByRole('combobox').selectOption('en-x-l1');

  await expect
    .poll(() => list.evaluate((element) => element.scrollTop))
    .toBe(scrollTop);
});

test('keyboard drag crosses a virtual viewport and persists order', async ({
  page,
}) => {
  await seed(page);
  await page.goto(routePaths.management);

  const handle = page.getByRole('button', {
    name: 'Reorder Word 0',
    exact: true,
  });
  await handle.focus();
  await page.keyboard.press('Space');

  for (let index = 0; index < 20; index++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
  }
  await page.keyboard.press('Space');

  await expect
    .poll(() =>
      page.evaluate(() => {
        const data = JSON.parse(
          localStorage.getItem('language-board.dataset') ?? '{}',
        );
        return data.order.indexOf('word-0');
      }),
    )
    .toBe(20);
});

test('wrapped translations resize without overlapping adjacent rows', async ({
  page,
}, testInfo) => {
  await seed(page, 2000);
  await page.goto(routePaths.management);

  await page
    .getByRole('textbox', { name: 'Word 0 translation', exact: true })
    .fill('A long translation that wraps across several lines. '.repeat(9));
  await page.goto(routePaths.public);

  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });

    const first = page.getByRole('heading', { name: 'word 0', exact: true });
    await expect(first).toBeVisible();

    await expect(async () => {
      const overlaps = await page
        .getByRole('list', { name: 'Translations', exact: true })
        .evaluate((element) => {
          const rows = Array.from(
            element.querySelectorAll(':scope > li[data-index]'),
          ).map((row) => row.getBoundingClientRect());
          return rows.some(
            (row, index) => index > 0 && row.top < rows[index - 1].bottom - 1,
          );
        });
      expect(overlaps).toBe(false);
    }).toPass();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`virtual-cards-${width}.png`),
    });
  }
});
