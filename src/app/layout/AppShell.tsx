import type { ReactNode } from 'react';
import { AppNavigation } from './AppNavigation';

interface AppShellProps {
  children: ReactNode;
  warning?: string;
}

export const AppShell = ({ children, warning }: AppShellProps) => {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AppNavigation />
      <main className="app-main" id="main" tabIndex={-1}>
        {warning && (
          <p role="alert" className="warning-banner">
            {warning}
          </p>
        )}
        {children}
      </main>
    </>
  );
};
