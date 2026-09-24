import { useEffect } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';

import { useTranslations } from '@/features/translations/hooks';
import { MotionSurface } from '@/shared';

import { AppShell } from '../layout';
import { routePaths } from './paths';

export const RouteLayout = () => {
  const { warning } = useTranslations();
  const isPublic = useMatch(routePaths.public) !== null;
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${isPublic ? 'Word Translations' : 'Translation Management'} · Language Board`;
  }, [isPublic]);

  return (
    <AppShell warning={warning}>
      <MotionSurface motionKey={pathname} variant="page">
        <Outlet />
      </MotionSurface>
    </AppShell>
  );
};
