import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Action, Dataset, Language } from '../types';

export interface TranslationState {
  data: Dataset;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  dispatch: Dispatch<Action>;
  warning: string;
  saved: boolean;
}

export const TranslationContext = createContext<TranslationState | null>(null);
