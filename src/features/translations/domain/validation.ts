import type { Dataset, LanguageDefinition } from '../types';

import {
  isObjectRecord,
  hasOwnProperty,
  isSafeEntityId,
  normalizeKeywordForComparison,
} from './helpers';
import { normalizeLanguageCode } from './language';

export const getLanguageValidationError = (
  language: LanguageDefinition,
  data: Dataset,
): string | null => {
  const code = normalizeLanguageCode(language.code);
  if (!code) return 'Enter a valid language code, such as de or pt-BR.';
  if (data.languages.some((item) => item.code === code))
    return 'This language already exists.';
  if (!language.label.trim() || language.label.trim().length > 80)
    return 'Enter a language name of 1–80 characters.';
  if (!['ltr', 'rtl'].includes(language.direction))
    return 'Choose a text direction.';
  return null;
};

export const getKeywordValidationError = (
  value: string,
  data: Dataset,
  excludedId?: string,
): string | null => {
  if (!value.trim()) return 'Enter a keyword.';
  if (value.trim().length > 80) return 'Use 80 characters or fewer.';
  if (
    data.keywords.order.some(
      (id) =>
        id !== excludedId &&
        normalizeKeywordForComparison(data.keywords.byId[id].keyword) ===
          normalizeKeywordForComparison(value),
    )
  )
    return 'This keyword already exists.';
  return null;
};

export const isValidDataset = (value: unknown): value is Dataset => {
  if (
    !isObjectRecord(value) ||
    value.version !== 2 ||
    !Array.isArray(value.languages) ||
    !value.languages.length ||
    !isObjectRecord(value.keywords)
  )
    return false;
  const codes = new Set<string>();
  for (const language of value.languages) {
    if (
      !isObjectRecord(language) ||
      typeof language.code !== 'string' ||
      normalizeLanguageCode(language.code) !== language.code ||
      codes.has(language.code) ||
      typeof language.label !== 'string' ||
      !language.label.trim() ||
      language.label.length > 80 ||
      (language.direction !== 'rtl' && language.direction !== 'ltr')
    )
      return false;
    codes.add(language.code);
  }
  const { order, byId } = value.keywords;
  if (
    !Array.isArray(order) ||
    !isObjectRecord(byId) ||
    order.length !== Object.keys(byId).length
  )
    return false;
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const id of order) {
    if (!isSafeEntityId(id) || ids.has(id) || !hasOwnProperty(byId, id))
      return false;
    const row = byId[id];
    if (
      !isObjectRecord(row) ||
      row.id !== id ||
      typeof row.keyword !== 'string' ||
      !row.keyword.trim() ||
      row.keyword.length > 80 ||
      names.has(normalizeKeywordForComparison(row.keyword)) ||
      !isObjectRecord(row.translations)
    )
      return false;
    if (
      !Object.entries(row.translations).every(
        ([code, text]) =>
          codes.has(code) && typeof text === 'string' && text.length <= 500,
      )
    )
      return false;
    ids.add(id);
    names.add(normalizeKeywordForComparison(row.keyword));
  }
  return true;
};
