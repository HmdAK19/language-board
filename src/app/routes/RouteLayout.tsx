import { useEffect } from 'react';
import { Outlet, useMatch } from 'react-router-dom';

import { useTranslations } from '@/features/translations/hooks';

import { AppShell } from '../layout';
import { routePaths } from './paths';

export const RouteLayout = () => {
  const { warning } = useTranslations();
  const isPublic = useMatch(routePaths.public) !== null;

  useEffect(() => {
    document.title = `${isPublic ? 'Word Translations' : 'Translation Management'} · Language Board`;
  }, [isPublic]);

  return (
    <AppShell warning={warning}>
      <Outlet />
    </AppShell>
  );
};
