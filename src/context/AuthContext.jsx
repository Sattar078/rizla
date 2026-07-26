import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.auth
        .me()
        .then(({ user: u }) => setUser(u))
        .catch(() => {
          localStorage.removeItem('rizla_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: u, token } = await api.auth.login({ email, password });
    localStorage.setItem('rizla_token', token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { user: u, token } = await api.auth.register({ name, email, password });
    localStorage.setItem('rizla_token', token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('rizla_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
