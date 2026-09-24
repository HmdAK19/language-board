import { parseDatasetJson, serializeDataset } from '../domain/datasetTransfer';
import type { Dataset } from '../types';

export const MAX_IMPORT_BYTES = 20 * 1024 * 1024;

export interface DatasetTransferService {
  read: (file: File) => Promise<Dataset>;
  download: (data: Dataset) => void;
}

export const browserDatasetTransfer: DatasetTransferService = {
  read: async (file) => {
    if (file.size > MAX_IMPORT_BYTES)
      throw new Error('Choose a JSON file smaller than 20 MB.');

    if (!file.size)
      throw new Error(
        'This file is empty. Choose a Language Board JSON export.',
      );

    let text: string;

    try {
      text = await file.text();
    } catch {
      throw new Error(
        'This file could not be read. Select it again and try once more.',
      );
    }

    return parseDatasetJson(text);
  },

  download: (data) => {
    const blob = new Blob([serializeDataset(data)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `language-board-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(anchor);

    try {
      anchor.click();
    } finally {
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  },
};
