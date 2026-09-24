import { describe, expect, it } from 'vitest';

import {
  createInitialDataset,
  isValidDataset,
  getKeywordValidationError,
  datasetReducer,
  migrateStoredDataset,
} from '../features/translations/domain';
import { createLocalRepository } from '../features/translations/services';

describe('translation domain', () => {
  it('deletes a keyword and all of its translations', () => {
    const original = createInitialDataset();
    const id = original.keywords.order[0];
    const result = datasetReducer(original, { type: 'deleteKeyword', id });

    expect(result.keywords.order).not.toContain(id);
    expect(result.keywords.byId).not.toHaveProperty(id);
    expect(result.keywords.order).toHaveLength(
      original.keywords.order.length - 1,
    );
  });

  it('adds one translation and leaves other languages empty', () => {
    const data = datasetReducer(createInitialDataset(), {
      type: 'add',
      id: 'new',
      keyword: ' Welcome ',
      language: 'fa',
      value: ' خوش آمدید ',
    });
    expect(data.keywords.byId.new).toEqual({
      id: 'new',
      keyword: 'Welcome',
      translations: {
        fa: 'خوش آمدید',
      },
    });
  });
  it('rejects empty and case-insensitive duplicate keywords', () => {
    const data = createInitialDataset();
    expect(getKeywordValidationError(' hello ', data)).toBeTruthy();
    expect(getKeywordValidationError(' ', data)).toBeTruthy();
    expect(
      datasetReducer(data, {
        type: 'add',
        id: 'new',
        keyword: 'hello',
        language: 'en',
        value: 'hi',
      }),
    ).toBe(data);
  });
  it('edits only the selected language without mutating the original', () => {
    const original = createInitialDataset();
    const result = datasetReducer(original, {
      type: 'edit',
      id: 'word-1',
      language: 'fa',
      value: '',
    });
    expect(
      result.keywords.byId[result.keywords.order[0]].translations.fa,
    ).toBeUndefined();
    expect(
      original.keywords.byId[original.keywords.order[0]].translations.fa,
    ).toBe('سلام');
    expect(result.keywords.byId[result.keywords.order[0]].translations.fr).toBe(
      'Bonjour',
    );
  });
  it('reorders while preserving stable ids and all translations', () => {
    const original = createInitialDataset();
    const result = datasetReducer(original, {
      type: 'move',
      from: 0,
      to: 7,
    });
    expect(result.keywords.byId[result.keywords.order[7]]).toEqual(
      original.keywords.byId[original.keywords.order[0]],
    );
    expect(result.keywords.byId[result.keywords.order[0]].keyword).toBe(
      'World',
    );
    expect(original.keywords.byId[original.keywords.order[0]].keyword).toBe(
      'Hello',
    );
    expect(
      datasetReducer(original, {
        type: 'move',
        from: -1,
        to: 2,
      }),
    ).toBe(original);
  });
  it('validates persisted schema, duplicate ids and translation types', () => {
    expect(isValidDataset(createInitialDataset())).toBe(true);
    expect(
      isValidDataset({
        ...createInitialDataset(),
        keywords: {
          order: [],
          byId: {},
        },
      }),
    ).toBe(true);
    expect(
      isValidDataset({
        version: 2,
        keywords: [],
      }),
    ).toBe(false);
    const data = createInitialDataset();
    data.keywords.order.push(data.keywords.order[0]);
    expect(isValidDataset(data)).toBe(false);
    expect(
      isValidDataset({
        version: 1,
        keywords: [
          {
            id: 'x',
            keyword: 'X',
            translations: {
              fa: 5,
            },
          },
        ],
      }),
    ).toBe(false);
  });
});

describe('persistence boundary', () => {
  it('seeds missing data and round-trips the entire dataset', () => {
    let stored: string | null = null;
    const repository = createLocalRepository(() => ({
      getItem: () => stored,
      setItem: (_key, value) => {
        stored = value;
      },
    }));
    expect(repository.load().warning).toBe('');
    expect(stored).toContain('"version":2');
    const data = createInitialDataset();
    repository.save(data);
    expect(repository.load().data).toEqual(data);
  });
  it.each(['{broken', '{"version":1,"keywords":[{}]}'])(
    'recovers corrupt storage: %s',
    (raw) => {
      const repository = createLocalRepository(() => ({
        getItem: () => raw,
        setItem: () => {},
      }));
      expect(repository.load().data).toEqual(createInitialDataset());
      expect(repository.load().warning).toBeTruthy();
    },
  );
  it('handles inaccessible storage and propagates failed saves', () => {
    const repository = createLocalRepository(() => {
      throw new Error('Denied');
    });
    expect(repository.load().data).toEqual(createInitialDataset());
    expect(() => repository.save(createInitialDataset())).toThrow('Denied');
  });
});

it('adds arbitrary languages without expanding existing translations and preserves both orders', () => {
  const original = createInitialDataset();
  const extended = datasetReducer(original, {
    type: 'addLanguage',
    language: {
      code: 'pt-br',
      label: 'Português',
      direction: 'ltr',
    },
  });
  expect(extended.languages.at(-1)?.code).toBe('pt-BR');
  expect(extended.keywords).toBe(original.keywords);
  const edited = datasetReducer(extended, {
    type: 'edit',
    id: 'word-1',
    language: 'pt-BR',
    value: 'Olá',
  });
  expect(edited.keywords.byId['word-1'].translations['pt-BR']).toBe('Olá');
  expect(edited.keywords.byId['word-1'].translations.fa).toBe('سلام');
  const reordered = datasetReducer(
    datasetReducer(edited, {
      type: 'move',
      from: 0,
      to: 3,
    }),
    {
      type: 'moveLanguage',
      from: 3,
      to: 0,
    },
  );
  const entries = new Map<string, string>();
  const repo = createLocalRepository(() => ({
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
  }));
  repo.save(reordered);
  expect(repo.load().data).toEqual(reordered);
  expect(reordered.keywords.order[3]).toBe('word-1');
  expect(reordered.languages[0].code).toBe('pt-BR');
});

it('rejects duplicate languages, invalid codes, unknown references and oversized translations', () => {
  const data = createInitialDataset();
  for (const code of ['AR', 'not a language']) {
    expect(
      datasetReducer(data, {
        type: 'addLanguage',
        language: {
          code,
          label: 'Example',
          direction: 'ltr',
        },
      }),
    ).toBe(data);
  }
  expect(
    datasetReducer(data, {
      type: 'edit',
      id: 'word-1',
      language: 'de',
      value: 'Hallo',
    }),
  ).toBe(data);
  expect(
    datasetReducer(data, {
      type: 'edit',
      id: 'word-1',
      language: 'en',
      value: 'a'.repeat(501),
    }),
  ).toBe(data);
  expect(
    datasetReducer(data, {
      type: 'add',
      id: 'word-1',
      keyword: 'New',
      language: 'en',
      value: 'New',
    }),
  ).toBe(data);
  expect(
    datasetReducer(data, {
      type: 'add',
      id: 'new',
      keyword: 'New',
      language: 'de',
      value: 'Neu',
    }),
  ).toBe(data);
  const invalid = structuredClone(data);
  invalid.keywords.byId['word-1'].translations.de = 'Hallo';
  expect(isValidDataset(invalid)).toBe(false);
  const orphan = structuredClone(data);
  orphan.keywords.order[0] = 'missing';
  expect(isValidDataset(orphan)).toBe(false);
  const unsafe = JSON.parse(
    '{"version":2,"languages":[{"code":"en","label":"English","direction":"ltr"}],"keywords":{"order":["__proto__"],"byId":{"__proto__":{"id":"__proto__","keyword":"X","translations":{}}}}}',
  );
  expect(isValidDataset(unsafe)).toBe(false);
});

it('migrates legacy data without losing values, IDs or order and retains the old storage key', () => {
  const legacy = JSON.stringify({
    version: 1,
    keywords: [
      {
        id: 'b',
        keyword: 'Custom',
        translations: {
          fa: 'سفارشی',
          en: '',
          fr: 'Personnalisé',
        },
      },
      {
        id: 'a',
        keyword: 'Hello',
        translations: {
          fa: 'درود',
          en: 'Hello',
          fr: 'Bonjour',
        },
      },
    ],
  });
  const entries = new Map([['language-board.dataset.v1', legacy]]);
  const repo = createLocalRepository(() => ({
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
  }));
  const { data, warning } = repo.load();
  expect(warning).toBe('');
  expect(data.version).toBe(2);
  expect(data.keywords.order).toEqual(['b', 'a']);
  expect(data.keywords.byId.b.translations).toEqual({
    fa: 'سفارشی',
    fr: 'Personnalisé',
  });
  repo.save(data);
  expect(entries.get('language-board.dataset.v1')).toBe(legacy);
  expect(repo.load().data).toEqual(data);
});

it('uses the version migration registry for legacy English datasets', () => {
  const data = createInitialDataset();
  const legacyEnglishDataset = {
    ...data,
    languages: data.languages.map((language) =>
      language.code === 'ar'
        ? { code: 'en', label: 'English', direction: 'ltr' as const }
        : language,
    ),
    keywords: {
      ...data.keywords,
      byId: Object.fromEntries(
        data.keywords.order.map((id) => {
          const keyword = data.keywords.byId[id];
          const translations = { ...keyword.translations };
          translations.en = translations.ar;
          delete translations.ar;

          return [id, { ...keyword, translations }];
        }),
      ),
    },
  };

  const migrated = migrateStoredDataset(legacyEnglishDataset);

  expect(migrated?.languages.map(({ code }) => code)).toEqual([
    'fa',
    'ar',
    'fr',
  ]);
  expect(migrated?.keywords.byId['word-1'].translations.ar).toBe('مرحباً');
  expect(migrateStoredDataset({ version: 3 })).toBeNull();
});
