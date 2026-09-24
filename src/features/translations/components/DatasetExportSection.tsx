import { Button } from '@/shared';

import type { Dataset } from '../types';
import { DatasetTransferSectionHeader } from './DatasetTransferSectionHeader';
import { DatasetTransferSummary } from './DatasetTransferSummary';
import styles from './DatasetTransferDialog.module.scss';

interface DatasetExportSectionProps {
  headingId: string;
  data: Dataset;
  message: string;
  error: string;
  onExport: () => void;
}

export const DatasetExportSection = ({
  headingId,
  data,
  message,
  error,
  onExport,
}: DatasetExportSectionProps) => (
  <section className={styles.section} aria-labelledby={headingId}>
    <DatasetTransferSectionHeader
      id={headingId}
      icon="↗"
      title="Export workspace"
      description="All languages, keywords and translations, in their current order. Active filters do not affect your export."
    />

    <DatasetTransferSummary data={data} showFormat />

    <Button variant="secondary" onClick={onExport}>
      Download JSON
    </Button>

    {message && (
      <p role="status" className={styles.feedback}>
        {message}
      </p>
    )}
    {error && (
      <p role="alert" className="error-text">
        {error}
      </p>
    )}
  </section>
);
