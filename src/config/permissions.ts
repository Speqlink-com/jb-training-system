export enum Role {
  AGENT = "AGENT",
  SALES_MANAGER = "SALES_MANAGER", 
  HOA = "HOA",
  TRAINER = "TRAINER",
  ADMIN = "ADMIN"
}

export enum Permission {
  // Agent permissions
  AGENTS_READ = "agents.read",
  AGENTS_CREATE = "agents.create",
  AGENTS_UPDATE = "agents.update",
  AGENTS_DELETE = "agents.delete",

  // Training permissions
  TRAININGS_READ = "trainings.read",
  TRAININGS_CREATE = "trainings.create",
  TRAININGS_UPDATE = "trainings.update",
  TRAININGS_DELETE = "trainings.delete",

  // Attendance permissions
  ATTENDANCE_READ = "attendance.read",
  ATTENDANCE_MANAGE = "attendance.manage",

  // Reports permissions
  REPORTS_READ = "reports.read",
  REPORTS_EXPORT = "reports.export",

  // User management permissions
  USERS_READ = "users.read",
  USERS_CREATE = "users.create",
  USERS_UPDATE = "users.update",
  USERS_DELETE = "users.delete",

  // Onboarding permissions
  ONBOARDING_READ = "onboarding.read",
  ONBOARDING_MANAGE = "onboarding.manage",

  // Workforce permissions
  WORKFORCE_READ = "workforce.read",
  WORKFORCE_MANAGE = "workforce.manage",

  // System permissions
  SYSTEM_SETTINGS = "system.settings",
  NOTIFICATIONS_MANAGE = "notifications.manage"
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.AGENT]: [
    Permission.AGENTS_READ, // Can read own profile
    Permission.TRAININGS_READ, // Can view own trainings
    Permission.REPORTS_READ // Can view own reports
  ],
  [Role.SALES_MANAGER]: [
    Permission.AGENTS_READ,
    Permission.AGENTS_UPDATE,
    Permission.TRAININGS_READ,
    Permission.ATTENDANCE_READ,
    Permission.REPORTS_READ,
    Permission.WORKFORCE_READ,
    Permission.ONBOARDING_READ,
    Permission.ONBOARDING_MANAGE
  ],
  [Role.HOA]: [
    Permission.AGENTS_READ,
    Permission.AGENTS_CREATE,
    Permission.AGENTS_UPDATE,
    Permission.TRAININGS_READ,
    Permission.TRAININGS_CREATE,
    Permission.ATTENDANCE_READ,
    Permission.REPORTS_READ,
    Permission.REPORTS_EXPORT,
    Permission.WORKFORCE_READ,
    Permission.ONBOARDING_READ,
    Permission.ONBOARDING_MANAGE,
    Permission.USERS_READ
  ],
  [Role.TRAINER]: [
    Permission.AGENTS_READ,
    Permission.TRAININGS_READ,
    Permission.TRAININGS_CREATE,
    Permission.TRAININGS_UPDATE,
    Permission.ATTENDANCE_READ,
    Permission.ATTENDANCE_MANAGE,
    Permission.REPORTS_READ,
    Permission.REPORTS_EXPORT
  ],
  [Role.ADMIN]: [
    Permission.AGENTS_READ,
    Permission.AGENTS_CREATE,
    Permission.AGENTS_UPDATE,
    Permission.AGENTS_DELETE,
    Permission.TRAININGS_READ,
    Permission.TRAININGS_CREATE,
    Permission.TRAININGS_UPDATE,
    Permission.TRAININGS_DELETE,
    Permission.ATTENDANCE_READ,
    Permission.ATTENDANCE_MANAGE,
    Permission.REPORTS_READ,
    Permission.REPORTS_EXPORT,
    Permission.WORKFORCE_READ,
    Permission.WORKFORCE_MANAGE,
    Permission.USERS_READ,
    Permission.USERS_CREATE,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.ONBOARDING_READ,
    Permission.ONBOARDING_MANAGE,
    Permission.SYSTEM_SETTINGS,
    Permission.NOTIFICATIONS_MANAGE
  ]
};

// Helper function to check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

// Helper function to check if a user can access a resource
export function canAccess(userRole: Role, requiredPermissions: Permission[]): boolean {
  const userPermissions = rolePermissions[userRole] || [];
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}