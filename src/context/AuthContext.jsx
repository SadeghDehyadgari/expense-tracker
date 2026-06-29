import { createContext, useState, useCallback, useMemo } from 'react';
// [NEW] Import buildApiUrl to construct full URLs for authentication
import { buildApiUrl } from '../hooks/useFetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

  const login = useCallback(async (email, password) => {
    // [NEW] Use buildApiUrl for MockAPI deployment
    const response = await fetch(buildApiUrl('/api/users'));

    if (!response.ok) {
      throw new Error('خطا در ارتباط با سرور');
    }
    const users = await response.json();

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error('ایمیل یا رمز ورود اشتباه است!');
    }

    const userObj = { id: foundUser.id, email: foundUser.email };
    setUser(userObj);
    localStorage.setItem('auth_user', JSON.stringify(userObj));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

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
