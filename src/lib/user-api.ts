import { apiClient } from "@/lib/api/client";

export type UserRoleValue = "ADMIN" | "TRAINER" | "SALES_MANAGER" | "HOA" | "AGENT";

export const USER_ROLE_LABELS: Record<UserRoleValue, string> = {
  ADMIN: "Administrator",
  TRAINER: "Trainer",
  SALES_MANAGER: "Sales manager",
  HOA: "Head of agency",
  AGENT: "Agent",
};

interface BackendUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  role: string;
  is_active: boolean;
  is_email_verified: boolean;
  is_password_changed: boolean;
  employee_id?: string | null;
  agent_code?: string | null;
  branch_id?: string | null;
  department?: string | null;
  territory?: string | null;
  specializations?: string | null;
  created_at?: string | null;
  last_login_at?: string | null;
}

export interface PlatformUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRoleValue;
  isActive: boolean;
  emailVerified: boolean;
  passwordChanged: boolean;
  employeeId?: string;
  agentCode?: string;
  branchId?: string;
  department?: string;
  territory?: string;
  specializations: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

export interface CreateUserResult {
  user: PlatformUser;
  invitationSent: boolean;
  message: string;
}

function mapUser(source: BackendUser): PlatformUser {
  return {
    id: source.id,
    email: source.email,
    firstName: source.first_name,
    lastName: source.last_name,
    phone: source.phone_number || undefined,
    role: (source.role === "super_admin" ? "ADMIN" : source.role.toUpperCase()) as UserRoleValue,
    isActive: source.is_active,
    emailVerified: source.is_email_verified,
    passwordChanged: source.is_password_changed,
    employeeId: source.employee_id || undefined,
    agentCode: source.agent_code || undefined,
    branchId: source.branch_id || undefined,
    department: source.department || undefined,
    territory: source.territory || undefined,
    specializations: source.specializations
      ? source.specializations.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
    createdAt: source.created_at || undefined,
    lastLoginAt: source.last_login_at || undefined,
  };
}

export async function listUsers(filters: { role?: UserRoleValue; search?: string; activeOnly?: boolean } = {}) {
  const query = new URLSearchParams({ limit: "100", active_only: String(filters.activeOnly ?? false) });
  if (filters.role) query.set("role", filters.role.toLowerCase());
  if (filters.search?.trim()) query.set("search", filters.search.trim());
  const response = await apiClient.request<{ users: BackendUser[]; total: number }>(`/api/auth/users?${query}`);
  return { users: response.data.users.map(mapUser), total: response.data.total };
}

export async function createUser(input: {
  role: UserRoleValue;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId?: string;
  branchId?: string;
  department?: string;
}) {
  const response = await apiClient.request<{ user: BackendUser; invitation_sent: boolean }>("/api/auth/users", {
    method: "POST",
    body: JSON.stringify({
      role: input.role.toLowerCase(),
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone_number: input.phone || null,
      employee_id: input.role === "AGENT" ? null : input.employeeId || null,
      agent_code: input.role === "AGENT" ? input.employeeId || null : null,
      branch_id: input.branchId || null,
      department: input.department || null,
    }),
  });
  return {
    user: mapUser(response.data.user),
    invitationSent: response.data.invitation_sent,
    message: response.message || "User created",
  } satisfies CreateUserResult;
}

export async function setUserStatus(userId: string, isActive: boolean) {
  const response = await apiClient.request<{ user: BackendUser }>(`/api/auth/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
  return mapUser(response.data.user);
}

export async function resendUserInvitation(userId: string) {
  const response = await apiClient.request<{ user: BackendUser }>(`/api/auth/users/${userId}/resend-invitation`, {
    method: "POST",
  });
  return mapUser(response.data.user);
}
