import type { Action, Dataset } from '../types';

import {
  addKeyword,
  clearKeywords,
  deleteKeyword,
  editKeywordTranslation,
  reorderKeywords,
  updateKeyword,
} from './keywordOperations';

type KeywordAction = Extract<
  Action,
  {
    type:
      | 'add'
      | 'edit'
      | 'updateKeyword'
      | 'deleteKeyword'
      | 'move'
      | 'clearKeywords';
  }
>;

export const reduceKeywordAction = (
  data: Dataset,
  action: KeywordAction,
): Dataset => {
  switch (action.type) {
    case 'add':
      return addKeyword(data, action);
    case 'edit':
      return editKeywordTranslation(data, action);
    case 'updateKeyword':
      return updateKeyword(data, action);
    case 'deleteKeyword':
      return deleteKeyword(data, action);
    case 'move':
      return reorderKeywords(data, action);
    case 'clearKeywords':
      return clearKeywords(data);
  }
};
