import type { Dataset, Language } from '../types';

export type TranslationStatus = 'all' | 'translated' | 'missing';

export const normalizeSearch = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\u200d]/g, '')
    .toLowerCase()
    .trim();

export const filterKeywords = (
  data: Dataset,
  language: Language,
  query: string,
  status: TranslationStatus,
): string[] => {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);

  if (status === 'all' && terms.length === 0) return data.order;

  return data.order.filter((id) => {
    const item = data.keywords[id];
    const translation = item.translations[language] ?? '';
    const translated = Boolean(translation.trim());

    if (status === 'translated' && !translated) return false;
    if (status === 'missing' && translated) return false;

    if (terms.length === 0) return true;

    const text = normalizeSearch(`${item.keyword} ${translation}`);

    return terms.every((term) => text.includes(term));
  });
};
