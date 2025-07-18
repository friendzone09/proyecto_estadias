import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/home/home';
import LoginScreen from './pages/login/loginScreen';
import RegisterScreen from './pages/register/registerScreen';
import Profile from './pages/profile/Profile';
import Body from './globalComponents/body';
import AppointAgend from './pages/AppointAgend/AppointAgend'
import EditProfile from './pages/profile/edit/EditProfile';
import Schedule from './pages/profile/schedules/Schedules';
import NotFound from './pages/Errors/NotFound/NotFound';
import UsersList from './pages/users/UsersList';
import NewUser from './pages/users/newUser/NewUser';
import MyPsycho from './pages/MyPsycho/MyPsycho';
import HowUse from './pages/HowUse/HowUse';
import MyPatients from './pages/MyPatients/MyPatiens';


function AppRoutes() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register'];
  const isLayoutVisible = !noLayoutRoutes.includes(location.pathname);

  return (
    <Routes>
      <Route path="/" element={isLayoutVisible ? <Body><Home /></Body> : <Home />} />

      <Route path="/profile" element={isLayoutVisible ? <Body><Profile /></Body> : <Home />} />
      <Route path="/profile/edit" element={isLayoutVisible ? <Body><EditProfile /></Body> : <Home />} />
      <Route path="/profile/schedules" element={isLayoutVisible ? <Body><Schedule /></Body> : <Home />} />

      <Route path='/test' element={isLayoutVisible ? <Body><Screen /></Body> : <Home />} />

      <Route path="/appointAgend/:id_psycho" element={isLayoutVisible ? <Body><AppointAgend /></Body> : <Home />} />

      <Route path="/admin/users" element={isLayoutVisible ? <Body><UsersList /></Body> : <Home />}/>

      <Route path="/admin/users/new" element={isLayoutVisible ? <Body><NewUser /></Body> : <Home />}/>

      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route path="/patient/psycho" element={isLayoutVisible ? <Body><MyPsycho /></Body> : <Home />}/>

      <Route path="/my-patients" element={isLayoutVisible ? <Body><MyPatients /></Body> : <Home />}/>

      <Route path='/how-use' element={isLayoutVisible ? <Body><HowUse /></Body> : <Home />}/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;