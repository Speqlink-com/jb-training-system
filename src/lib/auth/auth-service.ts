import type { User } from "@/types";
import {
  clearStoredSession,
  DEMO_ACCOUNTS,
  getStoredSession,
  getTrainers,
  initializeLocalPlatform,
  storeSession,
} from "@/lib/local-platform";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface InitialAdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    initializeLocalPlatform();
    await new Promise((resolve) => setTimeout(resolve, 350));
    const email = credentials.email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS.find(
      (candidate) => candidate.email === email && candidate.password === credentials.password,
    );
    if (!account) return { success: false, error: "Invalid email or password" };

    if (account.user.role === "TRAINER") {
      const trainer = getTrainers().find((candidate) => candidate.id === account.user.id);
      if (!trainer || trainer.status === "INACTIVE") {
        return { success: false, error: "This trainer account has been deactivated by an administrator" };
      }
    }

    storeSession(account.user);
    return { success: true, user: account.user };
  }

  restoreSession(): User | null {
    initializeLocalPlatform();
    const user = getStoredSession();
    if (user?.role === "TRAINER") {
      const trainer = getTrainers().find((candidate) => candidate.id === user.id);
      if (!trainer || trainer.status === "INACTIVE") {
        clearStoredSession();
        return null;
      }
    }
    return user;
  }

  async registerInitialAdmin(data: InitialAdminData, secretKey: string): Promise<AuthResult> {
    void data;
    void secretKey;
    return { success: false, error: "The local demo already includes an administrator account" };
  }

  async logout(): Promise<void> {
    clearStoredSession();
  }

  isAuthenticated(): boolean {
    return Boolean(getStoredSession());
  }

  getCurrentUser(): User | null {
    return this.restoreSession();
  }

  storeUser(user: User): void {
    storeSession(user);
  }

  clearUser(): void {
    clearStoredSession();
  }

  async refreshAuth(): Promise<boolean> {
    return this.isAuthenticated();
  }

  async checkApiHealth(): Promise<boolean> {
    return true;
  }

  getDemoUsers() {
    return DEMO_ACCOUNTS.map((account) => ({
      email: account.email,
      password: account.password,
      role: account.user.role,
      name: `${account.user.firstName} ${account.user.lastName}`,
    }));
  }
}

export const authService = new AuthService();
export default authService;
