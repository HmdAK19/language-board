import { useMemo, useState } from 'react';

import {
  filterKeywords,
  type TranslationStatus,
} from '../domain/filterKeywords';
import { useTranslations } from './useTranslations';

export const useKeywordFilters = () => {
  const { data, language } = useTranslations();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TranslationStatus>('all');

  const active = Boolean(query.trim()) || status !== 'all';
  const ids = useMemo(
    () => filterKeywords(data, language, query, status),
    [data, language, query, status],
  );

  return {
    query,
    setQuery,
    status,
    setStatus,
    active,
    ids,
    total: data.keywords.order.length,
    languageLabel:
      data.languages.find((item) => item.code === language)?.label ?? language,
    reset: () => {
      setQuery('');
      setStatus('all');
    },
  };
};
