import {
  createInitialDataset,
  isValidDataset,
  migrateStoredDataset,
} from '../domain';
import type { Dataset } from '../types';

export const STORAGE_KEY = 'language-board.dataset.v2';
export const LEGACY_STORAGE_KEY = 'language-board.dataset.v1';

export interface DatasetRepository {
  load(): {
    data: Dataset;
    warning: string;
  };
  save(data: Dataset): void;
}

export const createLocalRepository = (
  getStorage: () => Pick<Storage, 'getItem' | 'setItem'>,
): DatasetRepository => {
  let unreadableCurrentData = false;
  return {
    load() {
      try {
        const storage = getStorage();
        const current = storage.getItem(STORAGE_KEY);
        unreadableCurrentData = current !== null;
        const raw = current ?? storage.getItem(LEGACY_STORAGE_KEY);

        if (raw === null) {
          const seed = createInitialDataset();
          storage.setItem(STORAGE_KEY, JSON.stringify(seed));
          unreadableCurrentData = false;
          return {
            data: seed,
            warning: '',
          };
        }
        const data = migrateStoredDataset(JSON.parse(raw) as unknown);
        if (!data) throw new Error('Invalid dataset');
        if (current === null)
          storage.setItem(STORAGE_KEY, JSON.stringify(data));
        unreadableCurrentData = false;
        return {
          data,
          warning: '',
        };
      } catch {
        return {
          data: createInitialDataset(),
          warning:
            'Saved data could not be read. The starter words have been restored.',
        };
      }
    },
    save(data) {
      if (unreadableCurrentData)
        throw new Error(
          'Existing data could not be read; it has been preserved.',
        );
      if (!isValidDataset(data)) throw new Error('Invalid dataset');
      getStorage().setItem(STORAGE_KEY, JSON.stringify(data));
    },
  };
};

export const localRepository = createLocalRepository(() => window.localStorage);
