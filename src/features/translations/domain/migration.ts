import type { Dataset } from '../types';

import { isObjectRecord } from './helpers';
import { repairVersion2Dataset } from './repairVersion2Dataset';
import { upgradeVersion1DatasetToV2 } from './upgradeVersion1DatasetToV2';

type StoredDatasetTransformer = (value: unknown) => Dataset | null;

const transformerBySourceVersion: Readonly<
  Record<number, StoredDatasetTransformer>
> = {
  1: upgradeVersion1DatasetToV2,
  2: repairVersion2Dataset,
};

export const migrateStoredDataset = (value: unknown) => {
  if (!isObjectRecord(value) || typeof value.version !== 'number') return null;

  return transformerBySourceVersion[value.version]?.(value) ?? null;
};
