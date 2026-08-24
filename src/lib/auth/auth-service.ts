/**
 * Authentication Service
 * Handles authentication logic and user management
 */

import { User } from "@/types";
import { Role } from "@/config/permissions";
import { apiClient, LoginResponse } from "@/lib/api/client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  requiresOtp?: boolean;
}

export interface InitialAdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResult & { user?: User }> {
    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.message || 'Login failed',
        };
      }

      // Convert backend user format to frontend User type
      const user = this.mapBackendUserToFrontend(response.data.user);
      
      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Register initial admin (one-time setup)
   */
  async registerInitialAdmin(
    data: InitialAdminData,
    secretKey: string
  ): Promise<AuthResult> {
    try {
      const response = await apiClient.registerInitialAdmin({
        secret_key: secretKey,
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
      });

      return {
        success: response.success,
        error: response.success ? undefined : response.message,
      };
    } catch (error) {
      console.error('Initial admin registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.logout();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Get current user from stored token (if any)
   * This is a simplified version - in production you'd decode and validate the JWT
   */
  getCurrentUser(): User | null {
    const token = apiClient.getAccessToken();
    
    if (!token) return null;

    try {
      // For now, we'll get user data from localStorage
      // In production, you'd decode the JWT or make an API call to get current user
      const storedUser = localStorage.getItem('current_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Store user data locally
   */
  storeUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Clear stored user data
   */
  clearUser(): void {
    localStorage.removeItem('current_user');
  }

  /**
   * Refresh authentication tokens
   */
  async refreshAuth(): Promise<boolean> {
    return apiClient.refreshToken();
  }

  /**
   * Map backend user format to frontend User interface
   */
  private mapBackendUserToFrontend(backendUser: LoginResponse['user']): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      role: this.mapBackendRoleToFrontend(backendUser.role),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Map backend role format to frontend Role enum
   */
  private mapBackendRoleToFrontend(backendRole: string): Role {
    const roleMapping: Record<string, Role> = {
      'super_admin': Role.ADMIN,
      'admin': Role.ADMIN,
      'trainer': Role.TRAINER,
      'sales_manager': Role.SALES_MANAGER,
      'hoa': Role.HOA,
      'agent': Role.AGENT,
    };

    return roleMapping[backendRole.toLowerCase()] || Role.AGENT;
  }

  /**
   * Check API connectivity
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      await apiClient.healthCheck();
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;