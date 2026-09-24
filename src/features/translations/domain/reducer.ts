import type { Action, Dataset } from '../types';

import { isValidDataset } from './validation';
import { reduceKeywordAction } from './keywordReducer';
import { reduceLanguageAction } from './languageReducer';

export const datasetReducer = (data: Dataset, action: Action): Dataset => {
  switch (action.type) {
    case 'replaceDataset':
      return isValidDataset(action.data) ? action.data : data;
    case 'addLanguage':
    case 'removeLanguage':
    case 'moveLanguage':
    case 'clearLanguages':
      return reduceLanguageAction(data, action);
    case 'add':
    case 'edit':
    case 'updateKeyword':
    case 'deleteKeyword':
    case 'move':
    case 'clearKeywords':
      return reduceKeywordAction(data, action);
  }
};
