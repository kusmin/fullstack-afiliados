import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from "./pages/SignUp";
import { login } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = AuthService.usuarioCorrente();
    if (loggedInUser) {
      dispatch(login(loggedInUser));
    } else {
      if (location.pathname !== "/login" && location.pathname !== "/signup") { 
        navigate("/home");
      }
      
    }
  }, [dispatch]);

  return (
    <Router>
    <Routes>
      <Route
        path="/"
        render={() => (loggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />)}
        />
        <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

