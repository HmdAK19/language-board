import type { ChangeEvent, MouseEvent } from 'react';

import type { ImportState } from '../../hooks/useDatasetTransfer';
import type { Dataset } from '../../types';
import { DatasetTransferSectionHeader } from './DatasetTransferSectionHeader';
import { DatasetTransferSummary } from './DatasetTransferSummary';
import styles from './DatasetTransferDialog.module.scss';

interface DatasetImportSectionProps {
  headingId: string;
  fileInputId: string;
  state: ImportState;
  currentData: Dataset;
  confirmed: boolean;
  saved: boolean;
  onConfirmedChange: (confirmed: boolean) => void;
  onFileSelect: (file: File) => void;
}

const DatasetFilePicker = ({
  id,
  onFileSelect,
}: {
  id: string;
  onFileSelect: (file: File) => void;
}) => {
  const resetFileInput = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.value = '';
  };

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (file) onFileSelect(file);
  };

  return (
    <div className={styles.fileArea}>
      <label htmlFor={id}>Choose JSON file</label>
      <input
        id={id}
        type="file"
        accept=".json,application/json"
        aria-describedby={`${id}-help`}
        onClick={resetFileInput}
        onChange={selectFile}
      />
      <p id={`${id}-help`}>Language Board format · Version 2 · Up to 20 MB</p>
    </div>
  );
};

const DatasetImportPreview = ({
  state,
  currentData,
  confirmed,
  onConfirmedChange,
}: {
  state: Extract<ImportState, { status: 'ready' }>;
  currentData: Dataset;
  confirmed: boolean;
  onConfirmedChange: (confirmed: boolean) => void;
}) => (
  <div className={styles.preview}>
    <p role="status">
      <strong>{state.name}</strong> is ready to import.
    </p>

    <DatasetTransferSummary data={state.data} />

    <p className={styles.warning}>
      This replaces all {currentData.order.length} current keywords and{' '}
      {currentData.languages.length} languages. Download a backup above if you
      want to keep them.
    </p>
    <label className={styles.confirm}>
      <input
        type="checkbox"
        checked={confirmed}
        onChange={(event) => onConfirmedChange(event.target.checked)}
      />
      <span>Replace my current workspace with this file</span>
    </label>
  </div>
);

const DatasetImportFeedback = ({
  state,
  saved,
}: {
  state: ImportState;
  saved: boolean;
}) => {
  if (state.status === 'reading') {
    return (
      <p role="status" className={styles.feedback}>
        Reading {state.name}…
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <p role="alert" className="error-text">
        {state.message}
      </p>
    );
  }

  if (state.status === 'imported') {
    return (
      <p role="status" className={styles.feedback}>
        {saved
          ? 'Workspace imported and saved in this browser.'
          : 'Workspace imported for this session. Browser storage is unavailable; export a backup before closing.'}
      </p>
    );
  }

  return null;
};

export const DatasetImportSection = ({
  headingId,
  fileInputId,
  state,
  currentData,
  confirmed,
  saved,
  onConfirmedChange,
  onFileSelect,
}: DatasetImportSectionProps) => (
  <section
    className={styles.section}
    aria-labelledby={headingId}
    aria-busy={state.status === 'reading'}
  >
    <DatasetTransferSectionHeader
      id={headingId}
      icon="↙"
      title="Import workspace"
      description="Choose a JSON export to review before replacing your current workspace."
    />

    <DatasetFilePicker id={fileInputId} onFileSelect={onFileSelect} />

    <DatasetImportFeedback state={state} saved={saved} />

    {state.status === 'ready' && (
      <DatasetImportPreview
        state={state}
        currentData={currentData}
        confirmed={confirmed}
        onConfirmedChange={onConfirmedChange}
      />
    )}
  </section>
);
