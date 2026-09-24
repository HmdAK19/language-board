import type { Action, Dataset, Keyword, Language } from '../types';

import { hasOwnProperty, isSafeEntityId, moveArrayItem } from './helpers';
import { getKeywordValidationError } from './validation';

const hasLanguage = (data: Dataset, code: string): boolean =>
  data.languages.some((language) => language.code === code);

const normalizeTranslations = (
  data: Dataset,
  source: Partial<Record<Language, string>>,
): Partial<Record<Language, string>> | null => {
  const entries = Object.entries(source);
  if (
    !entries.length ||
    entries.some(
      ([code, value]) =>
        !hasLanguage(data, code) ||
        typeof value !== 'string' ||
        value.length > 500,
    )
  )
    return null;

  const translations = Object.fromEntries(
    entries
      .map(([code, value]) => [code, (value ?? '').trim()] as const)
      .filter(([, value]) => value),
  );

  return Object.keys(translations).length ? translations : null;
};

export const addKeyword = (
  data: Dataset,
  action: Extract<Action, { type: 'add' }>,
): Dataset => {
  if (
    !isSafeEntityId(action.id) ||
    hasOwnProperty(data.keywords, action.id) ||
    getKeywordValidationError(action.keyword, data)
  )
    return data;

  const source =
    action.translations ??
    (action.language ? { [action.language]: action.value ?? '' } : {});
  const translations = normalizeTranslations(data, source);
  if (!translations) return data;

  const keyword: Keyword = {
    id: action.id,
    keyword: action.keyword.trim(),
    translations,
  };

  return {
    ...data,
    keywords: { ...data.keywords, [keyword.id]: keyword },
    order: [...data.order, keyword.id],
  };
};

export const editKeywordTranslation = (
  data: Dataset,
  action: Extract<Action, { type: 'edit' }>,
): Dataset => {
  if (
    !hasLanguage(data, action.language) ||
    action.value.length > 500 ||
    !hasOwnProperty(data.keywords, action.id)
  )
    return data;

  const keyword = data.keywords[action.id];
  const value = action.value.trim();
  if ((keyword.translations[action.language] ?? '') === value) return data;

  const translations = { ...keyword.translations };

  if (value) translations[action.language] = value;
  else delete translations[action.language];

  return {
    ...data,
    keywords: {
      ...data.keywords,
      [keyword.id]: { ...keyword, translations },
    },
  };
};

export const updateKeyword = (
  data: Dataset,
  action: Extract<Action, { type: 'updateKeyword' }>,
): Dataset => {
  const current = data.keywords[action.id];
  if (!current || getKeywordValidationError(action.keyword, data, action.id))
    return data;

  const translations = normalizeTranslations(data, action.translations);
  if (!translations) return data;

  return {
    ...data,
    keywords: {
      ...data.keywords,
      [action.id]: {
        ...current,
        keyword: action.keyword.trim(),
        translations,
      },
    },
  };
};

export const deleteKeyword = (
  data: Dataset,
  action: Extract<Action, { type: 'deleteKeyword' }>,
): Dataset => {
  if (!hasOwnProperty(data.keywords, action.id)) return data;

  const keywords = { ...data.keywords };

  delete keywords[action.id];

  return {
    ...data,
    keywords,
    order: data.order.filter((id) => id !== action.id),
  };
};

export const reorderKeywords = (
  data: Dataset,
  action: Extract<Action, { type: 'move' }>,
): Dataset => {
  const order = moveArrayItem(data.order, action.from, action.to);

  return order === data.order ? data : { ...data, order };
};

export const clearKeywords = (data: Dataset): Dataset =>
  data.order.length ? { ...data, keywords: {}, order: [] } : data;
