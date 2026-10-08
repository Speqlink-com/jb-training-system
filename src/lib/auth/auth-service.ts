import type { User } from "@/types";
import { Role } from "@/config/permissions";
import { apiClient, ApiError } from "@/lib/api/client";
import { cacheUser, clearCachedUser, getCachedUser } from "@/lib/auth/session-cache";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  passwordChangeRequired?: boolean;
}

export interface InitialAdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

class AuthService {
  private mapUser(source: BackendUser): User {
    const role = source.role === "super_admin"
      ? Role.ADMIN
      : source.role.toUpperCase() as Role;
    const now = new Date().toISOString();
    return {
      id: source.id,
      email: source.email,
      firstName: source.first_name,
      lastName: source.last_name,
      role,
      agentId: source.agent_code || source.employee_id || undefined,
      branchId: source.branch_id || undefined,
      createdAt: now,
      updatedAt: now,
      isActive: source.is_active,
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await apiClient.request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        }),
      }, false);
      if (response.data.password_change_required) {
        clearCachedUser();
        return { success: false, passwordChangeRequired: true };
      }
      if (!response.data.user) return { success: false, error: "User details were not returned" };
      const user = this.mapUser(response.data.user);
      cacheUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ApiError ? error.message : "The authentication service is unavailable",
      };
    }
  }

  restoreSession(): User | null {
    return getCachedUser();
  }

  async checkAuth(): Promise<User | null> {
    try {
      const response = await apiClient.request<{ user: BackendUser }>("/api/auth/check-auth");
      const user = this.mapUser(response.data.user);
      cacheUser(user);
      return user;
    } catch {
      clearCachedUser();
      return null;
    }
  }

  async completeFirstTimePasswordChange(newPassword: string, confirmPassword: string): Promise<AuthResult> {
    try {
      const response = await apiClient.request<{ user: BackendUser }>(
        "/api/auth/first-time-password-change",
        {
          method: "POST",
          body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
        },
        false,
      );
      const user = this.mapUser(response.data.user);
      cacheUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ApiError ? error.message : "The password could not be changed",
      };
    }
  }

  async registerInitialAdmin(data: InitialAdminData, secretKey: string): Promise<AuthResult> {
    try {
      const response = await apiClient.request<{ user: BackendUser }>(
        "/api/auth/register-initial-admin",
        {
          method: "POST",
          body: JSON.stringify({
            secret_key: secretKey,
            email: data.email,
            password: data.password,
            first_name: data.firstName,
            last_name: data.lastName,
            phone_number: data.phoneNumber || null,
          }),
        },
        false,
      );
      return { success: true, user: this.mapUser(response.data.user) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof ApiError ? error.message : "Initial administrator setup failed",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.request("/api/auth/logout", { method: "POST" }, false);
    } catch {
      // The browser cache is still cleared when the session already expired.
    }
    clearCachedUser();
  }

  isAuthenticated(): boolean {
    return Boolean(getCachedUser());
  }

  getCurrentUser(): User | null {
    return this.restoreSession();
  }

  storeUser(user: User): void {
    cacheUser(user);
  }

  clearUser(): void {
    clearCachedUser();
  }

  async refreshAuth(): Promise<boolean> {
    return Boolean(await this.checkAuth());
  }

  async checkApiHealth(): Promise<boolean> {
    return apiClient.healthCheck();
  }
}

interface BackendUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  employee_id?: string | null;
  agent_code?: string | null;
  branch_id?: string | null;
}

interface LoginResponse {
  password_change_required: boolean;
  user?: BackendUser;
}

export const authService = new AuthService();
export default authService;
