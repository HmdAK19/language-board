import {
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import { datasetReducer } from '@/features/translations/domain';
import {
  localRepository,
  type DatasetRepository,
} from '@/features/translations/services';
import { TranslationContext } from '@/features/translations/store';
import type { Language } from '@/features/translations/types';

export const TranslationProvider = ({
  children,
  repository = localRepository,
}: {
  children: ReactNode;
  repository?: DatasetRepository;
}) => {
  const [initial] = useState(() => repository.load());
  const [data, dispatch] = useReducer(datasetReducer, initial.data);
  const [warning, setWarning] = useState(initial.warning);
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState<Language>(
    () => initial.data.languages[0]?.code ?? '',
  );

  useEffect(() => {
    if (!data.languages.some((item) => item.code === language))
      setLanguage(data.languages[0]?.code ?? '');
  }, [data.languages, language]);

  useEffect(() => {
    try {
      repository.save(data);
      setSaved(true);
      setWarning(initial.warning);
    } catch {
      setSaved(false);
      setWarning(
        'Changes are available in this session, but could not be saved. Check your browser storage settings before closing this page.',
      );
    }
  }, [data, repository, initial.warning]);

  const value = useMemo(
    () => ({
      data,
      dispatch,
      language,
      setLanguage,
      warning,
      saved,
    }),
    [data, language, warning, saved],
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
