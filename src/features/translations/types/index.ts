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
  version: 2;
  languages: LanguageDefinition[];
  keywords: {
    order: string[];
    byId: Record<string, Keyword>;
  };
}

export type Action =
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
    };
