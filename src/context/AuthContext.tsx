"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

type User = {
  username: string;
  role: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      const userData = response.data;
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set user state
      setUser(userData);
      
      // Set token in axios headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await axios.post('http://localhost:8080/api/account/signup', { userName: username, email, password });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  //ここあんま理解できてない
  const logout = () => {
    // Remove user from local storage
    localStorage.removeItem('user');
    
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  // Set token in axios headers if user exists
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }, [user]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}