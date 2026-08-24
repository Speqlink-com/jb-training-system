import { useAuth } from "@/lib/auth/auth-context";
import { Role, Permission, hasPermission as checkPermission, canAccess } from "@/config/permissions";

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return checkPermission(user.role, permission);
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return canAccess(user.role, permissions);
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => checkPermission(user.role, permission));
  };

  return {
    user,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions,
  };
}