import type { Action, Dataset } from '../types';

import { reduceKeywordAction } from './keywordReducer';
import { reduceLanguageAction } from './languageReducer';

export const datasetReducer = (data: Dataset, action: Action): Dataset => {
  switch (action.type) {
    case 'addLanguage':
    case 'removeLanguage':
    case 'moveLanguage':
      return reduceLanguageAction(data, action);
    case 'add':
    case 'edit':
    case 'updateKeyword':
    case 'move':
      return reduceKeywordAction(data, action);
  }
};
