import type { Dataset, Keyword } from '../types';
import { initialLanguages, words } from './seed';

export const createDatasetFromKeywords = (rows: Keyword[]): Dataset => {
  return {
    version: 2,
    languages: initialLanguages.map((language) => ({
      ...language,
    })),
    keywords: {
      order: rows.map((row) => row.id),
      byId: Object.fromEntries(
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
    },
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
