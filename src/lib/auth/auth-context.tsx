"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, AuthState } from "@/types";
import { Permission, Role, rolePermissions } from "@/config/permissions";
import { authService } from "@/lib/auth/auth-service";
import { SESSION_CHANGE_EVENT } from "@/lib/auth/session-cache";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; passwordChangeRequired?: boolean }>;
  completeFirstTimePasswordChange: (newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  checkApiHealth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncSession = () => setUser(authService.restoreSession());
    const initialize = async () => {
      try {
        setUser(authService.restoreSession());
        const verifiedUser = await authService.checkAuth();
        setUser(verifiedUser);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = window.setTimeout(() => void initialize(), 0);
    window.addEventListener("storage", syncSession);
    window.addEventListener(SESSION_CHANGE_EVENT, syncSession);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(SESSION_CHANGE_EVENT, syncSession);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });
      if (result.user) setUser(result.user);
      return {
        success: result.success,
        error: result.error,
        passwordChangeRequired: result.passwordChangeRequired,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const completeFirstTimePasswordChange = async (newPassword: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const result = await authService.completeFirstTimePasswordChange(newPassword, confirmPassword);
      if (result.user) setUser(result.user);
      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    authService.storeUser(updated);
  };

  const hasPermission = (permission: Permission) =>
    user ? (rolePermissions[user.role] || []).includes(permission) : false;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      completeFirstTimePasswordChange,
      logout,
      updateUser,
      hasPermission,
      hasRole: (role) => user?.role === role,
      checkApiHealth: () => authService.checkApiHealth(),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
