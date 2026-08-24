import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: string | Date, formatStr = "dd MMM yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return "Today";
  }
  
  if (isYesterday(dateObj)) {
    return "Yesterday";
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Number formatting utilities
export function formatCurrency(amount: number, currency = "KES"): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat("en-KE").format(number);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Text utilities
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Status color utilities
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    ACTIVE: "text-green-600 bg-green-50 border-green-200",
    INACTIVE: "text-gray-600 bg-gray-50 border-gray-200",
    PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
    COMPLETED: "text-green-600 bg-green-50 border-green-200",
    SCHEDULED: "text-blue-600 bg-blue-50 border-blue-200",
    IN_PROGRESS: "text-orange-600 bg-orange-50 border-orange-200",
    CANCELLED: "text-red-600 bg-red-50 border-red-200",
    PASSED: "text-green-600 bg-green-50 border-green-200",
    FAILED: "text-red-600 bg-red-50 border-red-200",
    REVIEW: "text-purple-600 bg-purple-50 border-purple-200"
  };
  
  return statusColors[status] || "text-gray-600 bg-gray-50 border-gray-200";
}

// Compliance utilities
export function getComplianceColor(compliance: number): string {
  if (compliance >= 95) return "text-green-600";
  if (compliance >= 85) return "text-yellow-600";
  return "text-red-600";
}

export function getComplianceStatus(compliance: number): string {
  if (compliance >= 95) return "Excellent";
  if (compliance >= 85) return "Good";
  if (compliance >= 70) return "Needs Improvement";
  return "Critical";
}

// Array utilities
export function groupBy<T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// Search utilities
export function createSearchFilter<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (typeof value === "string") {
        return value.toLowerCase().includes(term);
      }
      if (typeof value === "number") {
        return value.toString().includes(term);
      }
      return false;
    })
  );
}

// URL utilities
export function buildSearchParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// Local storage utilities
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === "undefined") return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail
  }
}