import { test, expect } from '@playwright/test';
import { routePaths } from '../src/app/routes/paths';

test('edit, add, switch languages, public view and reload share one dataset', async ({
  page,
}) => {
  await page.goto(routePaths.management);
  await page
    .getByRole('textbox', { name: 'Hello translation', exact: true })
    .fill('درود');
  await page.getByRole('button', { name: 'Add Keyword', exact: true }).click();
  await page.getByLabel('Keyword', { exact: true }).fill('Welcome');
  await page
    .getByLabel('Translation · فارسی', { exact: true })
    .fill('خوش آمدید');
  await page
    .getByRole('button', { name: 'Add keyword', exact: true })
    .last()
    .click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('combobox').selectOption('fr');
  await expect(
    page.getByRole('textbox', { name: 'Welcome translation' }),
  ).toHaveValue('');
  await page.getByRole('link', { name: 'Public Page' }).click();
  await expect(
    page.getByText('No translation yet', { exact: true }),
  ).toHaveCount(1);
  await page.getByRole('combobox').selectOption('fa');
  await expect(page.getByText('درود', { exact: true })).toBeVisible();
  await expect(page.getByText('خوش آمدید', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('درود', { exact: true })).toBeVisible();
});
test('keyboard reordering persists into public view', async ({ page }) => {
  await page.goto(routePaths.management);
  const handle = page.getByRole('button', {
    name: 'Reorder Hello',
    exact: true,
  });
  await handle.focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(page.getByRole('textbox').first()).toHaveAccessibleName(
    'World translation',
  );
  await page.reload();
  await expect(page.getByRole('textbox').first()).toHaveAccessibleName(
    'World translation',
  );
  await page.getByRole('link', { name: 'Public Page' }).click();
  await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
    'world',
  );
});
test('pointer drag changes order', async ({ page }) => {
  await page.goto(routePaths.management);
  const first = await page
    .getByRole('button', { name: 'Reorder Hello', exact: true })
    .boundingBox();
  if (!first) throw new Error('Missing drag handle');
  await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    first.x + first.width / 2,
    first.y + first.height / 2 + 110,
    { steps: 20 },
  );
  await page.mouse.up();
  await expect(page.getByRole('textbox').first()).toHaveAccessibleName(
    'World translation',
  );
});
test('corrupt storage recovers and duplicate input stays in the dialog', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('language-board.dataset', '{broken'),
  );
  await page.goto(routePaths.management);
  await expect(page.getByRole('alert')).toContainText('starter words');
  await page.getByRole('button', { name: 'Add Keyword', exact: true }).click();
  await page.getByLabel('Keyword', { exact: true }).fill('hello');
  await page.getByLabel('Translation · فارسی', { exact: true }).fill('hi');
  await page
    .getByRole('button', { name: 'Add keyword', exact: true })
    .last()
    .click();
  await expect(page.getByText('This keyword already exists.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Add Keyword', exact: true }),
  ).toBeFocused();
});
test('storage failure remains editable and reports unsaved changes', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Quota exceeded');
    };
  });
  await page.goto(routePaths.management);
  await page
    .getByRole('textbox', { name: 'Hello translation', exact: true })
    .fill('درود');
  await expect(page.getByRole('alert')).toContainText('could not be saved');
  await page.getByRole('link', { name: 'Public Page' }).click();
  await expect(page.getByText('درود', { exact: true })).toBeVisible();
});
for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`responsive layouts at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(routePaths.management);
    await expect(
      page.getByRole('heading', { name: 'Translation Management' }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByRole('link', { name: 'Public Page' }).click();
    await expect(
      page.getByRole('heading', { name: 'Word Translations' }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('form validation focuses invalid fields and accepts trimmed values', async ({
  page,
}) => {
  await page.goto(routePaths.management);
  await page.getByRole('button', { name: 'Add Keyword', exact: true }).click();
  const dialog = page.getByRole('dialog');
  const keyword = dialog.getByLabel('Keyword', { exact: true });
  await expect(keyword).toBeFocused();
  const translation = dialog.getByLabel('Translation · فارسی', { exact: true });
  await keyword.fill('   ');
  await translation.fill('   ');
  await dialog
    .getByRole('button', { name: 'Add keyword', exact: true })
    .click();
  await expect(keyword).toHaveAttribute('aria-invalid', 'true');
  await expect(keyword).toBeFocused();
  await expect(
    dialog.getByText('Enter at least one translation.').first(),
  ).toBeVisible();
  await keyword.fill('  Welcome  ');
  await translation.fill('  خوش آمدید  ');
  await dialog
    .getByRole('button', { name: 'Add keyword', exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole('textbox', { name: 'Welcome translation' }),
  ).toHaveValue('خوش آمدید');
});

test('dynamic languages, sparse translations and language order survive reload', async ({
  page,
}) => {
  await page.goto(routePaths.management);
  await page
    .getByRole('button', { name: 'Manage languages', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Language code').fill('AR');
  await dialog.getByLabel('Language name').fill('العربية');
  await dialog
    .getByRole('button', { name: 'Add language', exact: true })
    .click();
  await expect(dialog.getByRole('alert')).toHaveText(
    'This language already exists.',
  );
  await dialog.getByLabel('Language code').fill('ur');
  await dialog.getByLabel('Language name').fill('اردو');
  await dialog.getByLabel('Text direction').selectOption('rtl');
  await dialog
    .getByRole('button', { name: 'Add language', exact: true })
    .click();
  const hello = page.getByRole('textbox', {
    name: 'Hello translation',
    exact: true,
  });
  await expect(hello).toHaveValue('');
  await expect(hello).toHaveAttribute('dir', 'rtl');
  await hello.fill('آداب');
  await page.getByRole('button', { name: 'Add Keyword', exact: true }).click();
  await dialog.getByLabel('Keyword', { exact: true }).fill('Thanks');
  await dialog.getByLabel('Translation · اردو', { exact: true }).fill('شکریہ');
  await dialog
    .getByRole('button', { name: 'Add keyword', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Manage languages', exact: true })
    .click();
  for (let i = 0; i < 3; i++)
    await dialog
      .getByRole('button', { name: 'Move اردو up', exact: true })
      .click();
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('combobox')).toHaveValue('ur');
  await expect(hello).toHaveValue('آداب');
  await expect(page.getByRole('textbox').last()).toHaveAccessibleName(
    'Thanks translation',
  );
  await page.getByRole('link', { name: 'Public Page' }).click();
  await expect(page.getByText('شکریہ', { exact: true })).toBeVisible();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('language-board.dataset') ?? 'null'),
  );
  expect(
    stored.languages.map((language: { code: string }) => language.code),
  ).toEqual(['ur', 'fa', 'ar', 'fr']);
  expect(stored.keywords[stored.order.at(-1)].translations).toEqual({
    ur: 'شکریہ',
  });
});

for (const width of [320, 768, 1440]) {
  test(`language dialog fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(routePaths.management);
    await page
      .getByRole('button', { name: 'Manage languages', exact: true })
      .click();
    await expect(page.getByLabel('Language code')).toBeFocused();
    const dialog = page.getByRole('dialog');
    await expect
      .poll(() =>
        dialog
          .locator(':scope > div')
          .evaluate((content) => content.scrollHeight <= content.clientHeight),
      )
      .toBe(true);
    await expect(dialog.getByRole('button', { name: 'Done' })).toBeInViewport();
    await expect(
      dialog.getByRole('button', { name: 'Add language' }),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Manage languages', exact: true }),
    ).toBeFocused();
  });
}
