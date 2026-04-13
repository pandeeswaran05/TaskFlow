import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginAPI, signupAPI } from '../utils/Api';

const AuthContext = createContext(); // ✅ fixed naming (PascalCase)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw =
        localStorage.getItem('sh_user') ||
        sessionStorage.getItem('sh_user');
      return raw ? JSON.parse(raw) : null;
    } catch (error) { // ✅ better error handling
      console.error('Error parsing user from storage:', error);
      return null;
    }
  });

  const saveSession = useCallback((userData, token, persist) => {
    const userStr = JSON.stringify(userData);

    if (persist) {
      localStorage.setItem('sh_user', userStr);
      localStorage.setItem('sh_token', token);
    } else {
      localStorage.removeItem('sh_user');  // ✅ prevent stale data
      localStorage.removeItem('sh_token');
    }

    sessionStorage.setItem('sh_user', userStr);
    sessionStorage.setItem('sh_token', token);

    setUser(userData);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('sh_user');
    localStorage.removeItem('sh_token');
    sessionStorage.removeItem('sh_user');
    sessionStorage.removeItem('sh_token');
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password, remember) => {
      try {
        const res = await loginAPI(email, password);
        saveSession(res.data.user, res.data.token, remember);
        return res.data.user;
      } catch (error) { // ✅ handle API errors
        console.error('Login failed:', error);
        throw error;
      }
    },
    [saveSession]
  );

  const demoLogin = useCallback(() => {
    const demoUser = {
      id: 'demo',
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+91 98765 43210',
      createdAt: '01 Jan 2024',
      isDemo: true,
    };
    saveSession(demoUser, 'demo-token', false);
    return demoUser;
  }, [saveSession]);

  const signup = useCallback(async (data) => {
    try {
      const res = await signupAPI(data);
      return res.data;
    } catch (error) { // ✅ handle API errors
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const updateUser = useCallback(
    (newUserData, newToken) => {
      const persist = !!localStorage.getItem('sh_token');

      const token =
        newToken ||
        localStorage.getItem('sh_token') ||
        sessionStorage.getItem('sh_token');

      if (!token) {
        console.warn('No token found while updating user');
      }

      saveSession(newUserData, token, persist);
    },
    [saveSession]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        demoLogin,
        signup,
        logout,
        updateUser,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};// ✅ fixed reference