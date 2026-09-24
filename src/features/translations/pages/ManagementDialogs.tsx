import { AddKeywordDialog, ManageLanguagesDialog } from '../components';
import type { Dataset } from '../types';
import type { ManagementDialog } from '../hooks';

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

  if (dialog.type === 'manageLanguages')
    return <ManageLanguagesDialog onClose={onClose} />;

  if (dialog.type === 'addKeyword')
    return <AddKeywordDialog onClose={onClose} />;

  const keyword = data.keywords.byId[dialog.keywordId];
  return keyword ? (
    <AddKeywordDialog keyword={keyword} onClose={onClose} />
  ) : null;
};
