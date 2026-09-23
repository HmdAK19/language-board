import { useMemo, useRef } from 'react';

import { VirtualList } from '@/shared';

import { useTranslationColumns } from '../hooks/useTranslationColumns';
import { useTranslations } from '../hooks';
import { TranslationCard } from './TranslationCard';
import styles from './TranslationList.module.scss';

export const TranslationList = () => {
  const { data, language } = useTranslations();
  const container = useRef<HTMLDivElement>(null);
  const columns = useTranslationColumns(container);

  const rows = useMemo(() => {
    const result: string[][] = [];
    for (let index = 0; index < data.keywords.order.length; index += columns)
      result.push(data.keywords.order.slice(index, index + columns));
    return result;
  }, [data.keywords.order, columns]);

  return (
    <div ref={container} className={styles.container}>
      <VirtualList
        key={columns}
        className={styles.list}
        aria-label="Translations"
        items={rows}
        getKey={(row) => row[0]}
        estimateSize={180}
        rowClassName={styles.row}
        emptyState="No keywords have been added yet."
        renderItem={(row) => (
          <ul className={styles.grid}>
            {row.map((id) => (
              <TranslationCard
                key={id}
                keyword={data.keywords.byId[id].keyword}
                value={data.keywords.byId[id].translations[language] ?? ''}
                language={language}
              />
            ))}
          </ul>
        )}
      />
    </div>
  );
};
