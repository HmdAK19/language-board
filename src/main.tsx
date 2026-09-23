import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter';
import '@fontsource-variable/vazirmatn';

import { App } from '@/app';
import { TranslationProvider } from '@/app/providers';

import './app/styles/index.scss';

const root = document.getElementById('root');
if (!root) throw new Error('Root element missing');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </BrowserRouter>
  </StrictMode>,
);
