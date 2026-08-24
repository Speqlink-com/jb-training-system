import { Role, Permission } from "@/config/permissions";
import { ONBOARDING_STAGES, TRAINING_CATEGORIES } from "@/config/constants";

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  agentId?: string;
  branchId?: string;
  smId?: string;
  hoaId?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Agent Types
export interface Agent {
  id: string;
  agentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  branchId: string;
  branch: Branch;
  smId: string;
  sm: SalesManager;
  hoaId: string;
  hoa: HOA;
  appointmentDate: string;
  isActive: boolean;
  production?: AgentProduction;
  trainingCompliance?: number;
  pendingTrainings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentProduction {
  monthlyProduction: number;
  averageTicketSize: number;
  productivity: number;
  period: string;
}

// Sales Manager Types
export interface SalesManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  branchId: string;
  branch: Branch;
  hoaId: string;
  hoa: HOA;
  agentCount?: number;
  teamProduction?: number;
  trainingCompliance?: number;
  isActive: boolean;
}

// HOA Types
export interface HOA {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  region?: string;
  totalAgents?: number;
  salesManagerCount?: number;
  totalProduction?: number;
  trainingCompliance?: number;
  isActive: boolean;
}

// Trainer Types
export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string[];
  totalManpower?: number;
  trainingsConductive?: number;
  upcomingTrainings?: number;
  pendingReports?: number;
  isActive: boolean;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  code: string;
  region?: string;
  agentCount?: number;
  smCount?: number;
  isActive: boolean;
}

// Training Types
export interface Training {
  id: string;
  title: string;
  description?: string;
  category: keyof typeof TRAINING_CATEGORIES;
  subCategory?: string;
  trainerId: string;
  trainer: Trainer;
  scheduledDate: string;
  duration: number; // in hours
  location: string;
  branchId?: string;
  branch?: Branch;
  expectedManpower: number;
  actualAttendance?: number;
  attendanceRate?: number;
  productivity?: number;
  averageTicketSize?: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  materials?: TrainingMaterial[];
  attendees?: TrainingAttendance[];
  createdAt: string;
  updatedAt: string;
}

export interface TrainingMaterial {
  id: string;
  trainingId: string;
  name: string;
  type: "PDF" | "PPT" | "DOC" | "VIDEO" | "OTHER";
  url: string;
  size?: number;
}

export interface TrainingAttendance {
  id: string;
  trainingId: string;
  agentId: string;
  agent: Agent;
  attended: boolean;
  attendanceTime?: string;
  notes?: string;
}

// Onboarding Types
export interface Candidate {
  id: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedDate: string;
  stage: keyof typeof ONBOARDING_STAGES;
  status: "PENDING" | "PASSED" | "FAILED" | "REVIEW" | "SCHEDULED" | "COMPLETED";
  interviewDate?: string;
  aptitudeScore?: number;
  inductionDate?: string;
  agentCode?: string;
  notes?: string;
  assignedTo?: string; // User ID of person managing this candidate
}

// Report Types
export interface TrainingReport {
  id: string;
  title: string;
  type: "ATTENDANCE" | "COMPLETION" | "COMPLIANCE" | "PRODUCTIVITY";
  period: string;
  generatedBy: string;
  generatedAt: string;
  data: any; // JSON data for the report
  filters?: ReportFilters;
}

export interface ReportFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  branchId?: string;
  hoaId?: string;
  smId?: string;
  agentId?: string;
  trainerId?: string;
  trainingCategory?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalAgents: number;
  totalTrainings: number;
  pendingTrainings: number;
  trainingCompliance: number;
  monthlyProduction?: number;
  averageTicketSize?: number;
  productivity?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateAgentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branchId: string;
  smId: string;
  appointmentDate: string;
}

export interface CreateTrainingForm {
  title: string;
  description?: string;
  category: string;
  subCategory?: string;
  trainerId: string;
  scheduledDate: string;
  duration: number;
  location: string;
  branchId?: string;
  expectedManpower: number;
}

// UI Store Types
export interface UIState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  theme: "light" | "dark";
  activeModal: string | null;
}

export interface DashboardState {
  selectedBranch: string | null;
  selectedHOA: string | null;
  selectedSM: string | null;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface NotificationState {
  unreadCount: number;
  notificationPanelOpen: boolean;
}