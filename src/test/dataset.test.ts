import { describe, expect, it } from 'vitest';

import {
  createInitialDataset,
  isValidDataset,
  getKeywordValidationError,
  datasetReducer,
} from '../features/translations/domain';
import { createLocalRepository } from '../features/translations/services';

describe('translation domain', () => {
  it('deletes a keyword and all of its translations', () => {
    const original = createInitialDataset();
    const id = original.order[0];
    const result = datasetReducer(original, { type: 'deleteKeyword', id });

    expect(result.order).not.toContain(id);
    expect(result.keywords).not.toHaveProperty(id);
    expect(result.order).toHaveLength(original.order.length - 1);
  });

  it('adds one translation and leaves other languages empty', () => {
    const data = datasetReducer(createInitialDataset(), {
      type: 'add',
      id: 'new',
      keyword: ' Welcome ',
      language: 'fa',
      value: ' خوش آمدید ',
    });
    expect(data.keywords.new).toEqual({
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
    expect(result.keywords[result.order[0]].translations.fa).toBeUndefined();
    expect(original.keywords[original.order[0]].translations.fa).toBe('سلام');
    expect(result.keywords[result.order[0]].translations.fr).toBe('Bonjour');
  });
  it('reorders while preserving stable ids and all translations', () => {
    const original = createInitialDataset();
    const result = datasetReducer(original, {
      type: 'move',
      from: 0,
      to: 7,
    });
    expect(result.keywords[result.order[7]]).toEqual(
      original.keywords[original.order[0]],
    );
    expect(result.keywords[result.order[0]].keyword).toBe('World');
    expect(original.keywords[original.order[0]].keyword).toBe('Hello');
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
        keywords: {},
        order: [],
      }),
    ).toBe(true);
    expect(
      isValidDataset({
        keywords: [],
      }),
    ).toBe(false);
    const data = createInitialDataset();
    data.order.push(data.order[0]);
    expect(isValidDataset(data)).toBe(false);
    expect(
      isValidDataset({
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
    expect(stored).not.toContain('"version"');
    const data = createInitialDataset();
    repository.save(data);
    expect(repository.load().data).toEqual(data);
  });
  it.each(['{broken', '{"languages":[],"keywords":[{}],"order":[]}'])(
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
  expect(edited.keywords['word-1'].translations['pt-BR']).toBe('Olá');
  expect(edited.keywords['word-1'].translations.fa).toBe('سلام');
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
  expect(reordered.order[3]).toBe('word-1');
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
  invalid.keywords['word-1'].translations.de = 'Hallo';
  expect(isValidDataset(invalid)).toBe(false);
  const orphan = structuredClone(data);
  orphan.order[0] = 'missing';
  expect(isValidDataset(orphan)).toBe(false);
  const unsafe = JSON.parse(
    '{"languages":[{"code":"en","label":"English","direction":"ltr"}],"keywords":{"__proto__":{"id":"__proto__","keyword":"X","translations":{}}},"order":["__proto__"]}',
  );
  expect(isValidDataset(unsafe)).toBe(false);
});

it('clears keywords and languages while preserving a valid dataset', () => {
  const withoutKeywords = datasetReducer(createInitialDataset(), {
    type: 'clearKeywords',
  });
  expect(withoutKeywords.order).toEqual([]);
  expect(withoutKeywords.keywords).toEqual({});
  expect(isValidDataset(withoutKeywords)).toBe(true);

  const withoutLanguages = datasetReducer(createInitialDataset(), {
    type: 'clearLanguages',
  });
  expect(withoutLanguages.languages).toEqual([]);
  expect(
    withoutLanguages.order.every(
      (id) =>
        Object.keys(withoutLanguages.keywords[id].translations).length === 0,
    ),
  ).toBe(true);
  expect(isValidDataset(withoutLanguages)).toBe(true);
});
