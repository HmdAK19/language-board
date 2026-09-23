import { Suspense } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { routeConfig } from './routes';
import { ManagementPageSkeleton, PublicPageSkeleton } from '@/shared';

export const AppRoutes = () => {
  const routes = useRoutes(routeConfig);
  const isManagement = useLocation().pathname.startsWith('/manage');

  return (
    <Suspense
      fallback={
        isManagement ? <ManagementPageSkeleton /> : <PublicPageSkeleton />
      }
    >
      {routes}
    </Suspense>
  );
};
