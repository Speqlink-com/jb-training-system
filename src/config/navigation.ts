import { LucideIcon, Users, GraduationCap, BarChart3, Home, UserCheck, TrendingUp, Calendar } from "lucide-react";

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
        roles: ["ADMIN"]
      },
      {
        title: "Sales Managers",
        href: "/workforce/sales-managers",
        icon: UserCheck,
        description: "Sales manager profiles and teams",
        roles: ["ADMIN"]
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
    roles: ["ADMIN"]
  },
  {
    title: "Training",
    items: [
      {
        title: "Training Programs",
        href: "/trainings",
        icon: GraduationCap,
        description: "Manage training programs and schedules",
        roles: ["TRAINER", "ADMIN", "HOA", "SALES_MANAGER"]
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
        href: "/trainings",
        icon: GraduationCap,
        description: "Your training progress and schedule",
        roles: ["AGENT"]
      }
    ]
  },
  {
    title: "Reports",
    items: [
      {
        title: "Training Reports",
        href: "/reports",
        icon: BarChart3,
        description: "Analytics and reporting",
        roles: ["HOA", "SALES_MANAGER", "TRAINER", "ADMIN"]
      },
      {
        title: "My Training Report",
        href: "/reports",
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
      }
    ],
    roles: ["ADMIN"]
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
