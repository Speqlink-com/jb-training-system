// Application constants
export const APP_NAME = "Training Management Platform";
export const APP_DESCRIPTION = "Enterprise training and workforce management system";

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_VERSION = "v1";

// Training Categories
export const TRAINING_CATEGORIES = {
  NEW_AGENTS: "New Agents / Sales Interns",
  POST_TRAINING: "Post-Training Handholding",
  EXISTING_TARGETED: "Existing / Experienced Targeted Training",
  BRANCH_TRAINING: "Branch Training",
  SM_HOA_INDUCTION: "Sales Manager / HOA Induction",
  LEADERSHIP: "Leadership Training",
  SPECIALISED: "Specialised Training",
  ECOP: "ECOP Training",
  PERSONAL_FINANCE: "Personal Finance Management Clinics",
  ALTERNATIVE_DISTRIBUTION: "Alternative Distribution Training"
} as const;

// Specialized Training Sub-categories
export const SPECIALISED_TRAINING = {
  AML: "AML",
  TCF: "TCF", 
  DATA_PROTECTION: "Data Protection",
  FORCE: "FORCE",
  OTHER: "Other"
} as const;

// Alternative Distribution Sub-categories
export const ALTERNATIVE_DISTRIBUTION = {
  BANCASSURANCE: "Bancassurance",
  DIGITAL: "Digital"
} as const;

// Onboarding Stages
export const ONBOARDING_STAGES = {
  INTERVIEW: "INTERVIEW",
  INVITATION_SENT: "INVITATION_SENT", 
  APTITUDE_TEST: "APTITUDE_TEST",
  REVIEW_TEST: "REVIEW_TEST",
  INDUCTION: "INDUCTION",
  AGENCY_SERVICES: "AGENCY_SERVICES",
  ONBOARDING: "ONBOARDING",
  AGENT_CODE: "AGENT_CODE",
  ACTIVE: "ACTIVE"
} as const;

// Colors for charts and status indicators
export const COLORS = {
  PRIMARY: "#18181B",
  SECONDARY: "#737373",
  SUCCESS: "#16A34A",
  WARNING: "#D97706", 
  DANGER: "#DC2626",
  INFO: "#2563EB",
  MUTED: "#F0F0F0",
  BACKGROUND: "#F5F5F5",
  CARD: "#FFFFFF",
  BORDER: "#E5E5E5"
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy",
  INPUT: "yyyy-MM-dd",
  DATETIME: "dd MMM yyyy HH:mm",
  TIME: "HH:mm"
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;