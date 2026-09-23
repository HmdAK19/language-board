import type { Keyword } from '../types';

import { createDatasetFromKeywords } from './factory';
import { isObjectRecord, isSafeEntityId } from './helpers';
import { initialLanguages } from './seed';
import { isValidDataset } from './validation';

export const upgradeVersion1DatasetToV2 = (value: unknown) => {
  if (
    !isObjectRecord(value) ||
    value.version !== 1 ||
    !Array.isArray(value.keywords)
  )
    return null;

  const keywords: Keyword[] = [];

  for (const row of value.keywords) {
    if (
      !isObjectRecord(row) ||
      !isSafeEntityId(row.id) ||
      typeof row.keyword !== 'string' ||
      !isObjectRecord(row.translations)
    )
      return null;

    const translations: Record<string, string> = {};
    for (const { code } of initialLanguages) {
      const legacyCode = code === 'ar' ? 'en' : code;
      const text = row.translations[legacyCode];
      if (typeof text !== 'string' || text.length > 500) return null;
      translations[code] = text;
    }

    keywords.push({
      id: row.id,
      keyword: row.keyword,
      translations,
    });
  }

  const dataset = createDatasetFromKeywords(keywords);
  return isValidDataset(dataset) ? dataset : null;
};
