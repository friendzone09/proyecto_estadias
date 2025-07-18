import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollTop/ScrollTop';

import AppRoutes from './appRouter';
import AppWrapper from './utils/AppWrapper';
import { ToastProvider } from './contexts/alert/ToastContext';
import { LoadingProvider } from './contexts/loading/LoadingContext';

import './static/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoadingProvider>
      <ToastProvider>
        <AppWrapper>
          <ScrollToTop/>
          <AppRoutes />
        </AppWrapper>
      </ToastProvider>
    </LoadingProvider>
  </BrowserRouter>
);