import { useContext } from 'react';
import { TranslationContext } from '../store';

export const useTranslations = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('TranslationProvider is required.');
  return context;
};
