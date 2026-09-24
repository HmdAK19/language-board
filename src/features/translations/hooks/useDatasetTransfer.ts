import { useEffect, useRef, useState } from 'react';

import type { Dataset } from '../types';
import {
  browserDatasetTransfer,
  type DatasetTransferService,
} from '../services/datasetTransfer';
import { useTranslations } from './useTranslations';

export type ImportState =
  | { status: 'idle' }
  | { status: 'reading'; name: string }
  | { status: 'ready'; name: string; data: Dataset }
  | { status: 'error'; message: string }
  | { status: 'imported' };

export const useDatasetTransfer = (
  service: DatasetTransferService = browserDatasetTransfer,
) => {
  const { data, dispatch, language, setLanguage, saved } = useTranslations();
  const [state, setState] = useState<ImportState>({ status: 'idle' });
  const [confirmed, setConfirmed] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [exportError, setExportError] = useState('');
  const request = useRef(0);

  useEffect(
    () => () => {
      request.current += 1;
    },
    [],
  );

  const selectFile = async (file: File) => {
    const currentRequest = ++request.current;

    setConfirmed(false);
    setState({ status: 'reading', name: file.name });

    try {
      const imported = await service.read(file);

      if (currentRequest === request.current)
        setState({ status: 'ready', name: file.name, data: imported });
    } catch (error) {
      if (currentRequest === request.current)
        setState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Import failed. Please try again.',
        });
    }
  };

  const importData = () => {
    if (state.status !== 'ready' || !confirmed) return;

    dispatch({ type: 'replaceDataset', data: state.data });

    if (!state.data.languages.some(({ code }) => code === language))
      setLanguage(state.data.languages[0].code);

    setConfirmed(false);
    setState({ status: 'imported' });
  };

  const exportData = () => {
    setExportMessage('');
    setExportError('');

    try {
      service.download(data);
      setExportMessage('JSON export prepared. Check your browser downloads.');
    } catch {
      setExportError('The export could not be downloaded. Please try again.');
    }
  };

  return {
    data,
    saved,
    state,
    confirmed,
    setConfirmed,
    selectFile,
    importData,
    exportData,
    exportMessage,
    exportError,
  };
};
