import { Button } from '@/shared';
import styles from './ManagementActions.module.scss';

interface ManagementActionsProps {
  onDatasetTransfer: () => void;
  onAddKeyword: () => void;
  onManageLanguages: () => void;
}

export const ManagementActions = ({
  onDatasetTransfer,
  onAddKeyword,
  onManageLanguages,
}: ManagementActionsProps) => (
  <div className={styles.managementActions}>
    <Button
      className={styles.addButton}
      leadingIcon="＋"
      onClick={onAddKeyword}
    >
      Add Keyword
    </Button>
    <Button variant="secondary" onClick={onManageLanguages}>
      Manage languages
    </Button>
    <Button variant="secondary" onClick={onDatasetTransfer}>
      Import & export
    </Button>
  </div>
);
