import { AddKeywordDialog, ManageLanguagesDialog } from '../components';
import { DatasetTransferDialog } from '../components/DatasetTransferDialog';
import type { ManagementDialog } from '../hooks';
import type { Dataset } from '../types';

interface ManagementDialogsProps {
  dialog: ManagementDialog;
  data: Dataset;
  onClose: () => void;
}

export const ManagementDialogs = ({
  dialog,
  data,
  onClose,
}: ManagementDialogsProps) => {
  if (!dialog) return null;

  if (dialog.type === 'datasetTransfer')
    return <DatasetTransferDialog onClose={onClose} />;

  if (dialog.type === 'manageLanguages')
    return <ManageLanguagesDialog onClose={onClose} />;

  if (dialog.type === 'addKeyword')
    return <AddKeywordDialog onClose={onClose} />;

  const keyword = data.keywords[dialog.keywordId];
  return keyword ? (
    <AddKeywordDialog keyword={keyword} onClose={onClose} />
  ) : null;
};
