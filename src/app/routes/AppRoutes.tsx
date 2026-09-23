import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { routeConfig } from './routes';

export const AppRoutes = () => {
  const routes = useRoutes(routeConfig);

  return (
    <Suspense
      fallback={
        <p role="status" className="empty-state">
          Loading translations…
        </p>
      }
    >
      {routes}
    </Suspense>
  );
};
