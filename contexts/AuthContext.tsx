'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface RegistrationPayload extends AuthCredentials {
  name: string;
  phone?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthUser>;
  register: (payload: RegistrationPayload) => Promise<AuthUser>;
  logout: () => void;
}

interface StoredUser extends AuthUser {
  password: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const CURRENT_USER_KEY = 'asm_current_user';
const USERS_KEY = 'asm_registered_users';

function readStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as StoredUser[];
    }
  } catch (error) {
    console.warn('Failed to read stored users', error);
  }
  return [];
}

function persistUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistCurrentUser(user: StoredUser | null) {
  if (typeof window === 'undefined') {
    return;
  }
  if (user) {
    const { password, ...safeUser } = user;
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  } else {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.localStorage.getItem(CURRENT_USER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      }
    } catch (error) {
      console.warn('Failed to hydrate auth user', error);
    }
  }, []);

  const login = useCallback(async ({ email, password }: AuthCredentials) => {
    const users = readStoredUsers();
    const existing = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!existing || existing.password !== password) {
      throw new Error('اطلاعات ورود صحیح نیست. لطفاً ایمیل و رمز عبور را بررسی کنید.');
    }

    const { password: _password, ...safeUser } = existing;
    setUser(safeUser);
    persistCurrentUser(existing);
    return safeUser;
  }, []);

  const register = useCallback(async ({ email, name, password, phone }: RegistrationPayload) => {
    const users = readStoredUsers();
    const alreadyExists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());

    if (alreadyExists) {
      throw new Error('با این ایمیل قبلاً ثبت‌نام انجام شده است. لطفاً وارد شوید یا ایمیل دیگری را انتخاب کنید.');
    }

    const newUser: StoredUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      password
    };

    const updatedUsers = [newUser, ...users];
    persistUsers(updatedUsers);
    persistCurrentUser(newUser);
    const { password: _password, ...safeUser } = newUser;
    setUser(safeUser);
    return safeUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
