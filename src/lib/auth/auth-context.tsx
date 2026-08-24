"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthState } from "@/types";
import { Role } from "@/config/permissions";
import { authService } from "@/lib/auth/auth-service";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: Role) => boolean;
  checkApiHealth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user has valid tokens
        if (authService.isAuthenticated()) {
          const storedUser = authService.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Try to refresh tokens
            const refreshed = await authService.refreshAuth();
            if (!refreshed) {
              // Clear invalid tokens
              authService.clearUser();
              await authService.logout();
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear any invalid state
        authService.clearUser();
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        authService.storeUser(result.user);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || "Login failed" 
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An error occurred during login" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      authService.clearUser();
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      authService.storeUser(updatedUser);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Import permissions dynamically to avoid circular deps
    const { rolePermissions } = require("@/config/permissions");
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  const checkApiHealth = async (): Promise<boolean> => {
    return authService.checkApiHealth();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    checkApiHealth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}