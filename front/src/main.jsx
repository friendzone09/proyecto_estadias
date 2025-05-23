import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './appRouter';
import AppWrapper from './utils/AppWrapper';
import { ToastProvider } from './components/alert/ToastContext';

import './static/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <ToastProvider>
      <AppWrapper>
        <AppRoutes />
      </AppWrapper>
    </ToastProvider>
  </BrowserRouter>
);