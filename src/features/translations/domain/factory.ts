import type { Dataset, Keyword } from '../types';
import { initialLanguages, words } from './seed';

export const createDatasetFromKeywords = (rows: Keyword[]): Dataset => {
  return {
    languages: initialLanguages.map((language) => ({
      ...language,
    })),
    keywords: Object.fromEntries(
      rows.map((row) => [
        row.id,
        {
          ...row,
          translations: Object.fromEntries(
            Object.entries(row.translations).filter(([, value]) =>
              value?.trim(),
            ),
          ),
        },
      ]),
    ),
    order: rows.map((row) => row.id),
  };
};

export const createInitialDataset = (): Dataset =>
  createDatasetFromKeywords(
    words.map(([keyword, fa, ar, fr], index) => ({
      id: `word-${index + 1}`,
      keyword,
      translations: {
        fa,
        ar,
        fr,
      },
    })),
  );
