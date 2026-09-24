import { useMemo, useRef } from 'react';

import { VirtualList } from '@/shared';

import { useTranslationColumns } from '../hooks/useTranslationColumns';
import { useTranslations } from '../hooks';
import { TranslationCard } from './TranslationCard';
import { useKeywordFilters } from '../hooks/useKeywordFilters';
import { KeywordFilters } from './KeywordFilters';
import styles from './TranslationList.module.scss';

export const TranslationList = () => {
  const { data, language } = useTranslations();
  const filters = useKeywordFilters();
  const container = useRef<HTMLDivElement>(null);
  const columns = useTranslationColumns(container);

  const rows = useMemo(() => {
    const result: string[][] = [];

    for (let index = 0; index < filters.ids.length; index += columns)
      result.push(filters.ids.slice(index, index + columns));

    return result;
  }, [filters.ids, columns]);

  return (
    <div ref={container} className={styles.container}>
      <KeywordFilters filters={filters} />
      <VirtualList
        key={JSON.stringify([columns, filters.query, filters.status])}
        className={styles.list}
        aria-label="Translations"
        items={rows}
        getKey={(row) => row[0]}
        estimateSize={180}
        rowClassName={styles.row}
        emptyState={
          filters.active
            ? 'No matching keywords. Try another search or clear filters.'
            : 'No keywords have been added yet.'
        }
        renderItem={(row) => (
          <ul className={styles.grid}>
            {row.map((id) => (
              <TranslationCard
                key={id}
                keyword={data.keywords[id].keyword}
                value={data.keywords[id].translations[language] ?? ''}
                language={language}
              />
            ))}
          </ul>
        )}
      />
    </div>
  );
};
