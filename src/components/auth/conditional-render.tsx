import { usePermissions } from "@/hooks/use-permissions";
import { Role, Permission } from "@/config/permissions";

interface ConditionalRenderProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: Role[];
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, requires ALL permissions/roles, otherwise ANY
}

export function ConditionalRender({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = null,
  requireAll = false
}: ConditionalRenderProps) {
  const { hasAnyPermission, hasAllPermissions, hasAnyRole, hasRole } = usePermissions();

  // Check role requirements
  let hasRequiredRole = true;
  if (requiredRoles.length > 0) {
    hasRequiredRole = requireAll
      ? requiredRoles.every(role => hasRole(role))
      : hasAnyRole(requiredRoles);
  }

  // Check permission requirements  
  let hasRequiredPermission = true;
  if (requiredPermissions.length > 0) {
    hasRequiredPermission = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  // Render children if all requirements are met
  if (hasRequiredRole && hasRequiredPermission) {
    return <>{children}</>;
  }

  // Otherwise render fallback
  return <>{fallback}</>;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ConditionalRender requiredRoles={[Role.ADMIN]} fallback={fallback}>
      {children}
    </ConditionalRender>
  );
}

export function ManagerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ConditionalRender 
      requiredRoles={[Role.HOA, Role.SALES_MANAGER]} 
      fallback={fallback}
    >
      {children}
    </ConditionalRender>
  );
}

export function TrainerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ConditionalRender requiredRoles={[Role.TRAINER]} fallback={fallback}>
      {children}
    </ConditionalRender>
  );
}

export function AgentOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ConditionalRender requiredRoles={[Role.AGENT]} fallback={fallback}>
      {children}
    </ConditionalRender>
  );
}