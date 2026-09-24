import { describe, expect, it } from 'vitest';

import { createInitialDataset } from '../features/translations/domain/factory';
import {
  parseDatasetJson,
  serializeDataset,
} from '../features/translations/domain/datasetTransfer';
import { datasetReducer } from '../features/translations/domain/reducer';
import {
  browserDatasetTransfer,
  MAX_IMPORT_BYTES,
} from '../features/translations/services/datasetTransfer';

describe('JSON dataset transfer', () => {
  it('round-trips Unicode, empty translations and ordering', () => {
    const data = createInitialDataset();
    data.order.reverse();
    data.languages.reverse();

    expect(parseDatasetJson(serializeDataset(data))).toEqual(data);
    expect(parseDatasetJson('\uFEFF' + serializeDataset(data))).toEqual(data);
    expect(
      datasetReducer(createInitialDataset(), { type: 'replaceDataset', data }),
    ).toEqual(data);
  });

  it('rejects malformed JSON and invalid datasets instead of repairing data', () => {
    expect(() => parseDatasetJson('{')).toThrow('not valid JSON');

    for (const value of [
      null,
      [],
      {},
      { ...createInitialDataset(), order: ['missing'] },
    ]) {
      expect(() => parseDatasetJson(JSON.stringify(value))).toThrow(
        'valid Language Board JSON export',
      );
    }

    const data = createInitialDataset();
    data.order.push(data.order[0]);

    expect(() => parseDatasetJson(JSON.stringify(data))).toThrow();
  });

  it('rejects unsafe identifiers, unknown languages and invalid directions', () => {
    const data = createInitialDataset();
    const unsafe = JSON.parse(serializeDataset(data));
    unsafe.order[0] = '__proto__';

    expect(() => parseDatasetJson(JSON.stringify(unsafe))).toThrow();

    data.keywords['word-1'].translations.unknown = 'test';

    expect(() => parseDatasetJson(JSON.stringify(data))).toThrow();

    const invalidDirection = {
      ...createInitialDataset(),
      languages: [{ code: 'fa', label: 'فارسی', direction: ['rtl'] }],
    };

    expect(() => parseDatasetJson(JSON.stringify(invalidDirection))).toThrow();
  });

  it('checks file size before reading and handles read errors', async () => {
    await expect(
      browserDatasetTransfer.read(new File([], 'empty.json')),
    ).rejects.toThrow('empty');

    await expect(
      browserDatasetTransfer.read(
        new File([new Uint8Array(MAX_IMPORT_BYTES + 1)], 'large.json'),
      ),
    ).rejects.toThrow('20 MB');

    const file = new File(['{}'], 'unreadable.json');
    file.text = async () => {
      throw new Error('read failure');
    };

    await expect(browserDatasetTransfer.read(file)).rejects.toThrow(
      'could not be read',
    );
  });
});
