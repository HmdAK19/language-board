import { Button } from '@/shared';
import styles from './ManagementActions.module.scss';

interface ManagementActionsProps {
  onDatasetTransfer: () => void;
  onAddKeyword: () => void;
  onManageLanguages: () => void;
  onClearKeywords: () => void;
  hasKeywords: boolean;
  hasLanguages: boolean;
}

export const ManagementActions = ({
  onDatasetTransfer,
  onAddKeyword,
  onManageLanguages,
  onClearKeywords,
  hasKeywords,
  hasLanguages,
}: ManagementActionsProps) => (
  <div className={styles.managementActions}>
    <Button
      className={styles.addButton}
      leadingIcon="＋"
      onClick={onAddKeyword}
      disabled={!hasLanguages}
    >
      Add Keyword
    </Button>
    <Button variant="secondary" onClick={onManageLanguages}>
      Manage languages
    </Button>
    <Button variant="secondary" onClick={onDatasetTransfer}>
      Import & export
    </Button>
    <Button
      variant="secondary"
      disabled={!hasKeywords}
      onClick={onClearKeywords}
    >
      Delete all keywords
    </Button>
  </div>
);
