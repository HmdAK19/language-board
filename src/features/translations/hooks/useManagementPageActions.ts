import { useCallback, useState } from 'react';

import { useTranslations } from './useTranslations';

export type ManagementDialog =
  | { type: 'addKeyword' }
  | { type: 'editKeyword'; keywordId: string }
  | { type: 'manageLanguages' }
  | { type: 'datasetTransfer' }
  | null;

export const useManagementPageActions = () => {
  const { data, dispatch } = useTranslations();
  const [dialog, setDialog] = useState<ManagementDialog>(null);

  const closeDialog = useCallback(() => setDialog(null), []);
  const openAddKeyword = useCallback(
    () => setDialog({ type: 'addKeyword' }),
    [],
  );
  const openManageLanguages = useCallback(
    () => setDialog({ type: 'manageLanguages' }),
    [],
  );
  const openDatasetTransfer = useCallback(
    () => setDialog({ type: 'datasetTransfer' }),
    [],
  );

  const openEditKeyword = useCallback(
    (keywordId: string) => setDialog({ type: 'editKeyword', keywordId }),
    [],
  );
  const deleteKeyword = useCallback(
    (keywordId: string) => {
      const keyword = data.keywords[keywordId];
      if (
        keyword &&
        window.confirm(
          `Delete ${keyword.keyword}? All of its translations will be removed.`,
        )
      )
        dispatch({ type: 'deleteKeyword', id: keywordId });
    },
    [data.keywords, dispatch],
  );
  const clearKeywords = useCallback(() => {
    if (
      data.order.length &&
      window.confirm('Delete all keywords and all of their translations?')
    )
      dispatch({ type: 'clearKeywords' });
  }, [data.order.length, dispatch]);

  return {
    data,
    dialog,
    closeDialog,
    openAddKeyword,
    openManageLanguages,
    openEditKeyword,
    openDatasetTransfer,
    deleteKeyword,
    clearKeywords,
  };
};
