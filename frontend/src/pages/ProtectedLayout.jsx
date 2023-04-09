import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AuthService from '../service/AuthService';
import { login } from '../store/slices/authSlice';

const ProtectedLayout = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    const loggedInUser = AuthService.usuarioCorrente();;
    if (loggedInUser) {
      dispatch(login(loggedInUser));
      return <>{children}</>;
    }
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedLayout;