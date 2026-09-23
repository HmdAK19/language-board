import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import { routePaths } from './paths';
import { RouteLayout } from './RouteLayout';

const ManagementPage = lazy(
  () => import('@/features/translations/pages/ManagementPage'),
);
const PublicPage = lazy(
  () => import('@/features/translations/pages/PublicPage'),
);

export const routeConfig: RouteObject[] = [
  {
    element: <RouteLayout />,
    children: [
      { path: routePaths.public, element: <PublicPage /> },
      { path: routePaths.management, element: <ManagementPage /> },
    ],
  },
  { path: '*', element: <Navigate to={routePaths.public} replace /> },
];
