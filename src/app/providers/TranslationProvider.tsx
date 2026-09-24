import {
  useDeferredValue,
  useEffect,
  useMemo,
  useReducer,
  useRef,
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
  // localStorage serialization/validation is synchronous. Let urgent input
  // rendering finish first and coalesce rapid edits before persisting them.
  const dataToPersist = useDeferredValue(data);
  const latestData = useRef(data);
  latestData.current = data;
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
    const saveWarning =
      'Changes are available in this session, but could not be saved. Check your browser storage settings before closing this page.';

    try {
      repository.save(dataToPersist);
      setSaved(true);
      setWarning(initial.warning);
    } catch {
      setSaved(false);
      setWarning(
        initial.warning ? `${initial.warning} ${saveWarning}` : saveWarning,
      );
    }
  }, [dataToPersist, repository, initial.warning]);

  useEffect(() => {
    const flushPendingChanges = () => {
      try {
        repository.save(latestData.current);
      } catch {
        // The page is being discarded, so there is no useful UI update here.
      }
    };

    window.addEventListener('pagehide', flushPendingChanges);
    return () => window.removeEventListener('pagehide', flushPendingChanges);
  }, [repository]);

  const value = useMemo(
    () => ({
      data,
      dispatch,
      language,
      setLanguage,
      warning,
      saved: saved && dataToPersist === data,
    }),
    [data, dataToPersist, language, warning, saved],
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
