import { Role } from "@/config/permissions";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  agentId?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface UIState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
}

export interface NotificationState {
  unreadCount: number;
  notificationPanelOpen: boolean;
}
