import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/home/home';
import LoginScreen from './pages/login/loginScreen';
import RegisterScreen from './pages/register/registerScreen';
import Profile from './pages/profile/Profile';
import Body from './globalComponents/body';
import AppointAgend from './pages/AppointAgend/AppointAgend';

function AppRoutes() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register'];
  const isLayoutVisible = !noLayoutRoutes.includes(location.pathname);

  return (
    <Routes>
      <Route path="/" element={isLayoutVisible ? <Body><Home /></Body> : <Home />} />
      <Route path="/profile" element={isLayoutVisible ? <Body><Profile /></Body> : <Profile />} />
      <Route path="/appointAgend/:id_psycho" element={isLayoutVisible ? <Body><AppointAgend /></Body> : <AppointAgend />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
    </Routes>
  );
}

export default AppRoutes;