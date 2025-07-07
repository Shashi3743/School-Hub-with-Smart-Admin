/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [themeDark, setThemeDark] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const theme = localStorage.getItem('themeDark');
      const schoolToken = localStorage.getItem('schoolToken');

      if (theme) setThemeDark(JSON.parse(theme));

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.role) {
          setAuthenticated(true);
          setUser(parsedUser);
          console.log(user);
          
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (err) {
      console.error('AuthContext Error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (credentials) => {
    setAuthenticated(true);
    setUser(credentials);
    localStorage.setItem('user', JSON.stringify(credentials));
  };

  const logout = () => {
    localStorage.removeItem('token');
    if(localStorage.getItem("schoolToken")){
      localStorage.removeItem('schoolToken');
    }
    localStorage.removeItem('user');
    setAuthenticated(false);
    setUser(null);
  };

  const themeChange = () => {
    const next = !themeDark;
    localStorage.setItem('themeDark', JSON.stringify(next));
    setThemeDark(next);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, user, login, logout, loading, themeDark, themeChange }}
    >
      {children}
    </AuthContext.Provider>
  );
};
