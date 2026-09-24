import { useId } from 'react';

import { Button, Modal } from '@/shared';

import { useDatasetTransfer } from '../hooks/useDatasetTransfer';
import { DatasetExportSection } from './DatasetExportSection';
import { DatasetImportSection } from './DatasetImportSection';
import styles from './DatasetTransferDialog.module.scss';

export const DatasetTransferDialog = ({ onClose }: { onClose: () => void }) => {
  const transfer = useDatasetTransfer();
  const fileId = useId();
  const { state } = transfer;
  const exportHeadingId = `${fileId}-export`;
  const importHeadingId = `${fileId}-import`;

  return (
    <Modal
      title="Import & export"
      description="Back up your workspace or restore a Language Board JSON file."
      onClose={onClose}
    >
      <DatasetExportSection
        headingId={exportHeadingId}
        data={transfer.data}
        message={transfer.exportMessage}
        error={transfer.exportError}
        onExport={transfer.exportData}
      />

      <DatasetImportSection
        headingId={importHeadingId}
        fileInputId={fileId}
        state={state}
        currentData={transfer.data}
        confirmed={transfer.confirmed}
        saved={transfer.saved}
        onConfirmedChange={transfer.setConfirmed}
        onFileSelect={(file) => void transfer.selectFile(file)}
      />

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          {state.status === 'imported' ? 'Done' : 'Cancel'}
        </Button>
        <Button
          disabled={state.status !== 'ready' || !transfer.confirmed}
          onClick={transfer.importData}
        >
          Replace & import
        </Button>
      </div>
    </Modal>
  );
};
