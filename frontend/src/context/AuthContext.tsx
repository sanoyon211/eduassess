'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '../lib/axios';
import { UserRole, User } from '@/types'; // Imported from central types

// AuthUser can just extend the base User type
export interface AuthUser extends Omit<User, 'createdAt' | 'updatedAt'> {}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  // Load user credentials from storage on initial load
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = Cookies.get('eduassess_token') || localStorage.getItem('eduassess_token');
      const storedUser = Cookies.get('eduassess_user') || localStorage.getItem('eduassess_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser: AuthUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch (error) {
          console.error('[AuthContext] Failed to parse stored user data:', error);
          clearAuthData();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Automatic Redirection for protected routes
  useEffect(() => {
    if (isLoading) return;

    const protectedPrefixes = ['/admin', '/teacher', '/student'];
    const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (isProtectedRoute && !user) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('eduassess_token');
    Cookies.remove('eduassess_user');
    localStorage.removeItem('eduassess_token');
    localStorage.removeItem('eduassess_user');
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;

      const userPayload: AuthUser = {
        _id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      setToken(jwtToken);
      setUser(userPayload);

      // Persist in Cookies & localStorage
      Cookies.set('eduassess_token', jwtToken, { expires: 7 });
      Cookies.set('eduassess_user', JSON.stringify(userPayload), { expires: 7 });
      localStorage.setItem('eduassess_token', jwtToken);
      localStorage.setItem('eduassess_user', JSON.stringify(userPayload));

      // Redirect based on User Role
      if (userPayload.role === UserRole.ADMIN) {
        router.push('/admin');
      } else if (userPayload.role === UserRole.TEACHER) {
        router.push('/teacher');
      } else if (userPayload.role === UserRole.STUDENT) {
        router.push('/student');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false); // Only handle loading state here
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.STUDENT
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, role });
      // Automatically login user after registration
      await login(email, password);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = (): void => {
    clearAuthData();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};