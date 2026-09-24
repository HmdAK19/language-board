import type { Action, Dataset, Keyword, Language } from '../types';

import { hasOwnProperty, isSafeEntityId, moveArrayItem } from './helpers';
import { getKeywordValidationError } from './validation';

type KeywordAction = Extract<
  Action,
  { type: 'add' | 'edit' | 'updateKeyword' | 'move' }
>;

const hasLanguage = (data: Dataset, code: string): boolean =>
  data.languages.some((language) => language.code === code);

const getSubmittedTranslations = (
  data: Dataset,
  action: Extract<Action, { type: 'add' }>,
): Partial<Record<Language, string>> | null => {
  const source =
    action.translations ??
    (action.language ? { [action.language]: action.value ?? '' } : {});
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
      .map(([code, value]) => [code, value?.trim() ?? ''] as const)
      .filter(([, value]) => value),
  );

  return Object.keys(translations).length ? translations : null;
};

const addKeyword = (
  data: Dataset,
  action: Extract<Action, { type: 'add' }>,
): Dataset => {
  if (
    !isSafeEntityId(action.id) ||
    hasOwnProperty(data.keywords.byId, action.id) ||
    getKeywordValidationError(action.keyword, data)
  )
    return data;

  const translations = getSubmittedTranslations(data, action);
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
      byId: {
        ...data.keywords.byId,
        [keyword.id]: keyword,
      },
    },
  };
};

const editKeywordTranslation = (
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
        [keyword.id]: {
          ...keyword,
          translations,
        },
      },
    },
  };
};

const reorderKeywords = (data: Dataset, from: number, to: number): Dataset => {
  const order = moveArrayItem(data.keywords.order, from, to);
  if (order === data.keywords.order) return data;

  return {
    ...data,
    keywords: {
      ...data.keywords,
      order,
    },
  };
};

const updateKeyword = (
  data: Dataset,
  action: Extract<Action, { type: 'updateKeyword' }>,
): Dataset => {
  const current = data.keywords.byId[action.id];
  if (!current || getKeywordValidationError(action.keyword, data, action.id))
    return data;

  const translations = Object.fromEntries(
    Object.entries(action.translations)
      .filter(
        ([code, value]) =>
          hasLanguage(data, code) &&
          typeof value === 'string' &&
          value.trim() &&
          value.length <= 500,
      )
      .map(([code, value]) => [code, value.trim()]),
  );
  if (!Object.keys(translations).length) return data;

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

export const reduceKeywordAction = (
  data: Dataset,
  action: KeywordAction,
): Dataset => {
  switch (action.type) {
    case 'add':
      return addKeyword(data, action);
    case 'edit':
      return editKeywordTranslation(data, action);
    case 'updateKeyword':
      return updateKeyword(data, action);
    case 'move':
      return reorderKeywords(data, action.from, action.to);
  }
};
