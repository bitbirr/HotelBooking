/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name?: string;
  created_at?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      // Verify token and fetch fresh user data
      fetch('https://x8ki-letl-twmt.n7.xano.io/api:tnSst2CC/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Invalid token');
          }
        })
        .then(userData => {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:tnSst2CC/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.authToken;
        localStorage.setItem('authToken', token);

        // Fetch user details after login
        const userResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:tnSst2CC/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:tnSst2CC/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.authToken;
        localStorage.setItem('authToken', token);

        // Fetch user details after signup
        const userResponse = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:tnSst2CC/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};