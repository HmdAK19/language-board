import type { Dataset } from '../types';
import { isValidDataset } from './validation';

const copyDataset = (data: Dataset): Dataset => ({
  languages: data.languages.map(({ code, label, direction }) => ({
    code,
    label,
    direction,
  })),
  keywords: Object.fromEntries(
    data.order.map((id) => {
      const { keyword, translations } = data.keywords[id];

      return [id, { id, keyword, translations: { ...translations } }];
    }),
  ),
  order: [...data.order],
});

export const parseDatasetJson = (text: string): Dataset => {
  let value: unknown;

  try {
    value = JSON.parse(text.replace(/^\uFEFF/, ''));
  } catch {
    throw new Error(
      'This file is not valid JSON. Check the file and try again.',
    );
  }

  if (!isValidDataset(value)) {
    throw new Error(
      'Use a valid Language Board JSON export with matching languages, keywords and order.',
    );
  }

  return copyDataset(value);
};

export const serializeDataset = (data: Dataset): string => {
  if (!isValidDataset(data))
    throw new Error('The current dataset could not be exported.');

  return JSON.stringify(copyDataset(data), null, 2) + '\n';
};
