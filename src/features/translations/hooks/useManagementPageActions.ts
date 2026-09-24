import { useCallback, useState } from 'react';

import { useTranslations } from './useTranslations';

export type ManagementDialog =
  | { type: 'addKeyword' }
  | { type: 'editKeyword'; keywordId: string }
  | { type: 'manageLanguages' }
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
  const openEditKeyword = useCallback(
    (keywordId: string) => setDialog({ type: 'editKeyword', keywordId }),
    [],
  );
  const deleteKeyword = useCallback(
    (keywordId: string) => {
      const keyword = data.keywords.byId[keywordId];
      if (
        keyword &&
        window.confirm(
          `Delete ${keyword.keyword}? All of its translations will be removed.`,
        )
      )
        dispatch({ type: 'deleteKeyword', id: keywordId });
    },
    [data.keywords.byId, dispatch],
  );

  return {
    data,
    dialog,
    closeDialog,
    openAddKeyword,
    openManageLanguages,
    openEditKeyword,
    deleteKeyword,
  };
};
