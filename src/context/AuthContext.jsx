import React, { createContext, useState, useCallback, useMemo } from 'react';

// NEW: Auth context for authentication state management
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Lazy initialization: only runs once on mount
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('auth_user');
        return null;
      }
    }
    return null;
  });

  // Login command: validates email/password and stores user
  const login = useCallback(async (email, password) => {
    if (!email || !email.includes('@') || !password || password.length < 3) {
      throw new Error('ایمیل یا رمز ورود اشتباه است!');
    }
    const userObj = { email };
    setUser(userObj);
    localStorage.setItem('auth_user', JSON.stringify(userObj));
  }, []);

  // Logout command: clears user state and localStorage
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  // Query: authentication status derived from user
  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [user, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
