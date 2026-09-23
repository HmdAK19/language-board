import type { Action, Dataset, LanguageDefinition } from '../types';

import { moveArrayItem } from './helpers';
import { normalizeLanguageCode } from './language';
import { getLanguageValidationError } from './validation';

type LanguageAction = Extract<
  Action,
  { type: 'addLanguage' | 'removeLanguage' | 'moveLanguage' }
>;

const addLanguage = (data: Dataset, language: LanguageDefinition): Dataset => {
  if (getLanguageValidationError(language, data)) return data;

  return {
    ...data,
    languages: [
      ...data.languages,
      {
        ...language,
        code: normalizeLanguageCode(language.code) ?? language.code,
        label: language.label.trim(),
      },
    ],
  };
};

const removeLanguage = (data: Dataset, code: string): Dataset => {
  if (
    data.languages.length <= 1 ||
    !data.languages.some((language) => language.code === code)
  )
    return data;

  const byId = Object.fromEntries(
    data.keywords.order.map((id) => {
      const keyword = data.keywords.byId[id];
      const translations = { ...keyword.translations };
      delete translations[code];

      return [id, { ...keyword, translations }];
    }),
  );

  return {
    ...data,
    languages: data.languages.filter((language) => language.code !== code),
    keywords: {
      ...data.keywords,
      byId,
    },
  };
};

const reorderLanguages = (data: Dataset, from: number, to: number): Dataset => {
  const languages = moveArrayItem(data.languages, from, to);
  return languages === data.languages ? data : { ...data, languages };
};

export const reduceLanguageAction = (
  data: Dataset,
  action: LanguageAction,
): Dataset => {
  switch (action.type) {
    case 'addLanguage':
      return addLanguage(data, action.language);
    case 'removeLanguage':
      return removeLanguage(data, action.code);
    case 'moveLanguage':
      return reorderLanguages(data, action.from, action.to);
  }
};
