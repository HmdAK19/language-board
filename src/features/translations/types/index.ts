export type Language = string;

export interface LanguageDefinition {
  code: Language;
  label: string;
  direction: 'rtl' | 'ltr';
}

export interface Keyword {
  id: string;
  keyword: string;
  translations: Partial<Record<Language, string>>;
}

export interface Dataset {
  languages: LanguageDefinition[];
  keywords: Record<string, Keyword>;
  order: string[];
}

export type Action =
  | { type: 'replaceDataset'; data: Dataset }
  | {
      type: 'edit';
      id: string;
      language: Language;
      value: string;
    }
  | {
      type: 'updateKeyword';
      id: string;
      keyword: string;
      translations: Partial<Record<Language, string>>;
    }
  | {
      type: 'deleteKeyword';
      id: string;
    }
  | {
      type: 'add';
      id: string;
      keyword: string;
      language?: Language;
      value?: string;
      translations?: Partial<Record<Language, string>>;
    }
  | {
      type: 'addLanguage';
      language: LanguageDefinition;
    }
  | {
      type: 'removeLanguage';
      code: Language;
    }
  | {
      type: 'moveLanguage';
      from: number;
      to: number;
    }
  | {
      type: 'move';
      from: number;
      to: number;
    }
  | { type: 'clearKeywords' }
  | { type: 'clearLanguages' };
