import { createContext, useState, useCallback, useMemo } from 'react';

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

  // MODIFIED: Login command validates credentials against json-server /users endpoint
  // No unnecessary try/catch wrapper - errors propagate naturally to caller
  const login = useCallback(async (email, password) => {
    // NEW: Fetch users from json-server
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('خطا در ارتباط با سرور');
    }

    const users = await response.json();
    // NEW: Find user with matching email and password
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error('ایمیل یا رمز ورود اشتباه است!');
    }

    // NEW: Store only safe user data (exclude password)
    const userObj = { id: foundUser.id, email: foundUser.email };
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
