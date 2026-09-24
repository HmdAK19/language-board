import type { Dataset } from '../types';
import { isValidDataset } from './validation';

const copyDataset = (data: Dataset): Dataset => ({
  version: 2,
  languages: data.languages.map(({ code, label, direction }) => ({
    code,
    label,
    direction,
  })),
  keywords: {
    order: [...data.keywords.order],
    byId: Object.fromEntries(
      data.keywords.order.map((id) => {
        const { keyword, translations } = data.keywords.byId[id];

        return [id, { id, keyword, translations: { ...translations } }];
      }),
    ),
  },
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
      'Use a Language Board JSON export (version 2) with valid languages, unique keywords and matching translations.',
    );
  }

  return copyDataset(value);
};

export const serializeDataset = (data: Dataset): string => {
  if (!isValidDataset(data))
    throw new Error('The current dataset could not be exported.');

  return JSON.stringify(copyDataset(data), null, 2) + '\n';
};
