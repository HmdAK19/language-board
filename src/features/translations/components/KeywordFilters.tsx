import { useId } from 'react';

import type { useKeywordFilters } from '../hooks/useKeywordFilters';
import styles from './KeywordFilters.module.scss';

export const KeywordFilters = ({
  filters,
  management = false,
}: {
  filters: ReturnType<typeof useKeywordFilters>;
  management?: boolean;
}) => {
  const id = useId();

  return (
    <div className={styles.toolbar} role="search" aria-label="Filter keywords">
      <div className={styles.controls}>
        <div className={styles.search}>
          <label htmlFor={id}>Search keywords</label>
          <input
            id={id}
            type="search"
            dir="auto"
            value={filters.query}
            onChange={(event) => filters.setQuery(event.target.value)}
            placeholder="Keyword or translation…"
            aria-describedby={`${id}-hint`}
          />
        </div>

        <fieldset className={styles.status}>
          <legend>Translation status</legend>
          <div>
            {(['all', 'translated', 'missing'] as const).map((status) => (
              <button
                key={status}
                type="button"
                aria-pressed={filters.status === status}
                onClick={() => filters.setStatus(status)}
              >
                {status === 'all'
                  ? 'All'
                  : status === 'translated'
                    ? 'Translated'
                    : 'Missing'}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          className={styles.reset}
          disabled={!filters.active}
          onClick={filters.reset}
        >
          Clear filters
        </button>
      </div>

      <div className={styles.summary}>
        <span role="status">
          {filters.ids.length} of {filters.total} keywords
        </span>
        <span id={`${id}-hint`}>
          Translations in {filters.languageLabel}
          {management && filters.active ? ' · Clear filters to reorder' : ''}
        </span>
      </div>
    </div>
  );
};
