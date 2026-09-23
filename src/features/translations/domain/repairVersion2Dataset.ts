import type { Dataset, Keyword, LanguageDefinition } from '../types';

import { arabicSeed, legacyEnglishSeed } from './seed';
import { isValidDataset } from './validation';

const includesLegacyEnglishLanguage = (languages: LanguageDefinition[]) =>
  languages.some(
    (language) => language.code === 'en' && language.label === 'English',
  );

const repairDefaultArabicTranslations = (dataset: Dataset): Dataset => {
  const byId = Object.fromEntries(
    dataset.keywords.order.map((id, index) => {
      const keyword = dataset.keywords.byId[id];
      const expectedEnglish = legacyEnglishSeed[index];
      const expectedArabic = arabicSeed[index];
      const shouldReplace =
        keyword.keyword === expectedEnglish &&
        keyword.translations.ar === expectedEnglish &&
        expectedArabic !== undefined;

      const repaired: Keyword = shouldReplace
        ? {
            ...keyword,
            translations: {
              ...keyword.translations,
              ar: expectedArabic,
            },
          }
        : keyword;

      return [id, repaired];
    }),
  );

  return {
    ...dataset,
    keywords: {
      ...dataset.keywords,
      byId,
    },
  };
};

const replaceLegacyEnglishLanguageWithArabic = (dataset: Dataset): Dataset => {
  const languages = dataset.languages.map((language) =>
    language.code === 'en'
      ? {
          code: 'ar',
          label: 'العربية',
          direction: 'rtl' as const,
        }
      : language,
  );
  const byId = Object.fromEntries(
    dataset.keywords.order.map((id) => {
      const keyword = dataset.keywords.byId[id];
      const translations = { ...keyword.translations };

      if (translations.en !== undefined) {
        translations.ar = translations.en;
        delete translations.en;
      }

      return [id, { ...keyword, translations }];
    }),
  );

  return {
    ...dataset,
    languages,
    keywords: {
      ...dataset.keywords,
      byId,
    },
  };
};

export const repairVersion2Dataset = (value: unknown): Dataset | null => {
  if (!isValidDataset(value)) return null;

  if (includesLegacyEnglishLanguage(value.languages)) {
    const repaired = replaceLegacyEnglishLanguageWithArabic(value);
    return isValidDataset(repaired) ? repaired : null;
  }

  const repaired = repairDefaultArabicTranslations(value);
  return isValidDataset(repaired) ? repaired : value;
};
