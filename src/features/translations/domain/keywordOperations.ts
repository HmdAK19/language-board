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
      .map(([code, value]) => [code, value.trim()] as const)
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
    hasOwnProperty(data.keywords.byId, action.id) ||
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
    keywords: {
      order: [...data.keywords.order, keyword.id],
      byId: { ...data.keywords.byId, [keyword.id]: keyword },
    },
  };
};

export const editKeywordTranslation = (
  data: Dataset,
  action: Extract<Action, { type: 'edit' }>,
): Dataset => {
  if (
    !hasLanguage(data, action.language) ||
    action.value.length > 500 ||
    !hasOwnProperty(data.keywords.byId, action.id)
  )
    return data;

  const keyword = data.keywords.byId[action.id];
  const value = action.value.trim();
  if ((keyword.translations[action.language] ?? '') === value) return data;

  const translations = { ...keyword.translations };
  if (value) translations[action.language] = value;
  else delete translations[action.language];

  return {
    ...data,
    keywords: {
      ...data.keywords,
      byId: {
        ...data.keywords.byId,
        [keyword.id]: { ...keyword, translations },
      },
    },
  };
};

export const updateKeyword = (
  data: Dataset,
  action: Extract<Action, { type: 'updateKeyword' }>,
): Dataset => {
  const current = data.keywords.byId[action.id];
  if (!current || getKeywordValidationError(action.keyword, data, action.id))
    return data;

  const translations = normalizeTranslations(data, action.translations);
  if (!translations) return data;

  return {
    ...data,
    keywords: {
      ...data.keywords,
      byId: {
        ...data.keywords.byId,
        [action.id]: {
          ...current,
          keyword: action.keyword.trim(),
          translations,
        },
      },
    },
  };
};

export const deleteKeyword = (
  data: Dataset,
  action: Extract<Action, { type: 'deleteKeyword' }>,
): Dataset => {
  if (!hasOwnProperty(data.keywords.byId, action.id)) return data;
  const byId = { ...data.keywords.byId };
  delete byId[action.id];
  return {
    ...data,
    keywords: {
      order: data.keywords.order.filter((id) => id !== action.id),
      byId,
    },
  };
};

export const reorderKeywords = (
  data: Dataset,
  action: Extract<Action, { type: 'move' }>,
): Dataset => {
  const order = moveArrayItem(data.keywords.order, action.from, action.to);
  return order === data.keywords.order
    ? data
    : { ...data, keywords: { ...data.keywords, order } };
};
