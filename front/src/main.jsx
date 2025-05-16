import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './appRouter';
import AppWrapper from './utils/AppWrapper';

import './static/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppWrapper>
      <AppRoutes />
    </AppWrapper>
  </BrowserRouter>
);