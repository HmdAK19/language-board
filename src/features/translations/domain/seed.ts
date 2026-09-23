import type { LanguageDefinition } from '../types';

const initialLanguages: LanguageDefinition[] = [
  {
    code: 'fa',
    label: 'فارسی',
    direction: 'rtl',
  },
  {
    code: 'ar',
    label: 'العربية',
    direction: 'rtl',
  },
  {
    code: 'fr',
    label: 'Français',
    direction: 'ltr',
  },
];

const words = [
  ['Hello', 'سلام', 'مرحباً', 'Bonjour'],
  ['World', 'جهان', 'العالم', 'Monde'],
  ['Apple', 'سیب', 'تفاحة', 'Pomme'],
  ['Book', 'کتاب', 'كتاب', 'Livre'],
  ['Key', '', 'مفتاح', 'Clé'],
  ['Head', 'سر', 'رأس', 'Tête'],
  ['Green', 'سبز', 'أخضر', 'Vert'],
  ['Food', '', 'طعام', 'Nourriture'],
];

const legacyEnglishSeed = [
  'Hello',
  'World',
  'Apple',
  'Book',
  'Key',
  'Head',
  'Green',
  'Food',
];

const arabicSeed = [
  'مرحباً',
  'العالم',
  'تفاحة',
  'كتاب',
  'مفتاح',
  'رأس',
  'أخضر',
  'طعام',
];

export { initialLanguages, words, legacyEnglishSeed, arabicSeed };
