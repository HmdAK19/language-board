import type { Dataset } from '../types';
import styles from './DatasetTransferDialog.module.scss';

interface DatasetTransferSummaryProps {
  data: Dataset;
  showFormat?: boolean;
}

export const DatasetTransferSummary = ({
  data,
  showFormat = false,
}: DatasetTransferSummaryProps) => (
  <div className={styles.summary}>
    <span>
      <strong>{data.order.length}</strong> keywords
    </span>
    <span>
      <strong>{data.languages.length}</strong> languages
    </span>
    {showFormat && <span>JSON · v2</span>}
  </div>
);
