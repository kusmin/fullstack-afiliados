import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from "./pages/SignUp";
import AuthService from './service/AuthService';
import { login } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    const loggedInUser = AuthService.usuarioCorrente();
    if (loggedInUser) {
      dispatch(login(loggedInUser));
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [dispatch]);

  return (
    <Router>
    <Routes>
      <Route
        path="/"
        element={<Home />} 
        />
        <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

