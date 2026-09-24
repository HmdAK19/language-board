import { describe, expect, it } from 'vitest';

import {
  filterKeywords,
  normalizeSearch,
} from '../features/translations/domain/filterKeywords';
import { createInitialDataset } from '../features/translations/domain/factory';

describe('keyword filtering', () => {
  const data = createInitialDataset();

  it('matches keyword and selected translation with normalized multiword queries', () => {
    expect(filterKeywords(data, 'fr', ' HELLO bonj ', 'all')).toEqual([
      'word-1',
    ]);
    expect(filterKeywords(data, 'fa', 'كتاب', 'all')).toEqual(['word-4']);
    expect(filterKeywords(data, 'fa', 'Bonjour', 'all')).toEqual([]);

    expect(normalizeSearch('كِتاب يک می‌رود')).toBe('کتاب یک میرود');
  });

  it('combines status and search without changing stored order', () => {
    expect(filterKeywords(data, 'fa', '', 'missing')).toEqual([
      'word-5',
      'word-8',
    ]);
    expect(filterKeywords(data, 'fa', 'food', 'translated')).toEqual([]);
    expect(filterKeywords(data, 'fr', '', 'missing')).toEqual([]);
    expect(filterKeywords(data, 'fa', '   ', 'all')).toEqual(data.order);

    expect(data.order).toHaveLength(8);
  });
});
