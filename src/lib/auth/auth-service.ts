/**
 * Authentication Service
 * Handles authentication logic and user management
 * DEMO VERSION - Uses local auth for Vercel deployment
 */

import { User } from "@/types";
import { Role } from "@/config/permissions";

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

// Demo users for presentation (no backend required)
const DEMO_USERS: Array<{
  email: string;
  password: string;
  user: User;
}> = [
  {
    email: "admin@trainsyt.com",
    password: "Admin123!@#",
    user: {
      id: "admin-1",
      email: "admin@trainsyt.com",
      firstName: "Super",
      lastName: "Admin",
      role: Role.ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    email: "hoa@trainsyt.com",
    password: "HOA123!@#",
    user: {
      id: "hoa-1",
      email: "hoa@trainsyt.com",
      firstName: "John",
      lastName: "Doe",
      role: Role.HOA,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    email: "manager@trainsyt.com",
    password: "Manager123!@#",
    user: {
      id: "manager-1",
      email: "manager@trainsyt.com",
      firstName: "Sarah",
      lastName: "Wilson",
      role: Role.SALES_MANAGER,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    email: "trainer@trainsyt.com",
    password: "Trainer123!@#",
    user: {
      id: "trainer-1",
      email: "trainer@trainsyt.com",
      firstName: "Michael",
      lastName: "Brown",
      role: Role.TRAINER,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    email: "agent@trainsyt.com",
    password: "Agent123!@#",
    user: {
      id: "agent-1",
      email: "agent@trainsyt.com",
      firstName: "Emma",
      lastName: "Johnson",
      role: Role.AGENT,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
];

class AuthService {
  private isDemo = process.env.NODE_ENV === 'production' || !process.env.NEXT_PUBLIC_API_URL;

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResult & { user?: User }> {
    try {
      // Demo mode - use local authentication
      if (this.isDemo) {
        return this.demoLogin(credentials);
      }

      // Production mode - use API (when backend is deployed)
      const { apiClient } = await import("@/lib/api/client");
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
      // Fallback to demo mode if API fails
      return this.demoLogin(credentials);
    }
  }

  /**
   * Demo login for presentation (no backend required)
   */
  private async demoLogin(credentials: LoginCredentials): Promise<AuthResult & { user?: User }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const demoUser = DEMO_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!demoUser) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Store demo token
    localStorage.setItem('demo_token', 'demo_jwt_token');
    
    return {
      success: true,
      user: demoUser.user,
    };
  }

  /**
   * Register initial admin (one-time setup)
   */
  async registerInitialAdmin(
    data: InitialAdminData,
    secretKey: string
  ): Promise<AuthResult> {
    try {
      // Demo mode - simulate successful setup
      if (this.isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }

      // Production mode - use API
      const { apiClient } = await import("@/lib/api/client");
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
    if (this.isDemo) {
      localStorage.removeItem('demo_token');
      return;
    }

    try {
      const { apiClient } = await import("@/lib/api/client");
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (this.isDemo) {
      return !!localStorage.getItem('demo_token');
    }

    try {
      const { apiClient } = require("@/lib/api/client");
      return apiClient.isAuthenticated();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user from stored token (if any)
   */
  getCurrentUser(): User | null {
    try {
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
    if (this.isDemo) {
      localStorage.removeItem('demo_token');
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshAuth(): Promise<boolean> {
    if (this.isDemo) {
      return !!localStorage.getItem('demo_token');
    }

    try {
      const { apiClient } = await import("@/lib/api/client");
      return apiClient.refreshToken();
    } catch (error) {
      return false;
    }
  }

  /**
   * Map backend user format to frontend User interface
   */
  private mapBackendUserToFrontend(backendUser: any): User {
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
    if (this.isDemo) {
      return true; // Always healthy in demo mode
    }

    try {
      const { apiClient } = await import("@/lib/api/client");
      await apiClient.healthCheck();
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  /**
   * Get demo users for presentation
   */
  getDemoUsers(): Array<{email: string; password: string; role: string; name: string}> {
    return DEMO_USERS.map(u => ({
      email: u.email,
      password: u.password,
      role: u.user.role,
      name: `${u.user.firstName} ${u.user.lastName}`
    }));
  }
}
}

// Export singleton instance
export const authService = new AuthService();
export default authService;