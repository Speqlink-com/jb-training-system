"use client";

import { useAuth } from "./auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role, Permission } from "@/config/permissions";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: Role[];
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackUrl = "/auth/login"
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hasPermission, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackUrl);
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      // Check role requirements
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => hasRole(role));
        if (!hasRequiredRole) {
          router.push("/dashboard"); // Redirect to dashboard if no permission
          return;
        }
      }

      // Check permission requirements
      if (requiredPermissions.length > 0) {
        const hasRequiredPermission = requiredPermissions.some(permission => 
          hasPermission(permission)
        );
        if (!hasRequiredPermission) {
          router.push("/dashboard"); // Redirect to dashboard if no permission
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, requiredPermissions, requiredRoles, router, hasPermission, hasRole, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredPermissions?: Permission[];
    requiredRoles?: Role[];
    fallbackUrl?: string;
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}