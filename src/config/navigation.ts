import { LucideIcon, Users, GraduationCap, BarChart3, Settings, Bell, Home, UserCheck, TrendingUp, FileText, Calendar } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  disabled?: boolean;
  children?: NavItem[];
  roles?: string[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  roles?: string[];
}

export const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Overview and key metrics",
        roles: ["AGENT", "SALES_MANAGER", "HOA", "TRAINER", "ADMIN"]
      }
    ]
  },
  {
    title: "Workforce",
    items: [
      {
        title: "Agents",
        href: "/agents",
        icon: Users,
        description: "Manage agents and their profiles",
        roles: ["SALES_MANAGER", "HOA", "TRAINER", "ADMIN"]
      },
      {
        title: "Sales Managers",
        href: "/workforce/sales-managers",
        icon: UserCheck,
        description: "Sales manager profiles and teams",
        roles: ["HOA", "ADMIN"]
      },
      {
        title: "HOAs",
        href: "/workforce/hoas",
        icon: TrendingUp,
        description: "Head of Agency management",
        roles: ["ADMIN"]
      },
      {
        title: "Trainers",
        href: "/workforce/trainers",
        icon: GraduationCap,
        description: "Training staff management",
        roles: ["ADMIN"]
      }
    ],
    roles: ["SALES_MANAGER", "HOA", "TRAINER", "ADMIN"]
  },
  {
    title: "Training",
    items: [
      {
        title: "Training Programs",
        href: "/trainings",
        icon: GraduationCap,
        description: "Manage training programs and schedules",
        roles: ["TRAINER", "ADMIN", "HOA"]
      },
      {
        title: "Attendance",
        href: "/trainings/attendance",
        icon: Calendar,
        description: "Track training attendance",
        roles: ["TRAINER", "ADMIN"]
      },
      {
        title: "My Trainings",
        href: "/agents/trainings",
        icon: GraduationCap,
        description: "Your training progress and schedule",
        roles: ["AGENT"]
      }
    ]
  },
  {
    title: "Onboarding",
    items: [
      {
        title: "New Joiners",
        href: "/onboarding",
        icon: UserCheck,
        description: "Manage candidate onboarding process",
        roles: ["SALES_MANAGER", "HOA", "ADMIN"]
      }
    ],
    roles: ["SALES_MANAGER", "HOA", "ADMIN"]
  },
  {
    title: "Reports",
    items: [
      {
        title: "Training Reports",
        href: "/reports",
        icon: BarChart3,
        description: "Analytics and reporting",
        roles: ["HOA", "TRAINER", "ADMIN"]
      },
      {
        title: "My Performance",
        href: "/agents/performance",
        icon: TrendingUp,
        description: "Your performance metrics",
        roles: ["AGENT"]
      }
    ]
  },
  {
    title: "Administration",
    items: [
      {
        title: "Users",
        href: "/users",
        icon: Users,
        description: "User management and permissions",
        roles: ["ADMIN"]
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "System configuration",
        roles: ["ADMIN"]
      }
    ],
    roles: ["ADMIN"]
  },
  {
    title: "Notifications",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        description: "System notifications and alerts",
        roles: ["AGENT", "SALES_MANAGER", "HOA", "TRAINER", "ADMIN"]
      }
    ]
  }
];

// Helper function to filter navigation based on user role
export function getNavigationForRole(userRole: string): NavGroup[] {
  return navigation
    .map(group => ({
      ...group,
      items: group.items.filter(item => 
        !item.roles || item.roles.includes(userRole)
      )
    }))
    .filter(group => 
      group.items.length > 0 && 
      (!group.roles || group.roles.includes(userRole))
    );
}