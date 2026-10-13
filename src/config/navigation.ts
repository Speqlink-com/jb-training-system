import { LucideIcon, Users, GraduationCap, BarChart3, Home, UserCheck, TrendingUp, Calendar } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
        roles: ["AGENT", "SALES_MANAGER", "HOA", "TRAINER", "SUPER_TRAINER", "ADMIN"]
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
        roles: ["ADMIN"]
      },
      {
        title: "Sales Managers",
        href: "/workforce/sales-managers",
        icon: UserCheck,
        roles: ["ADMIN"]
      },
      {
        title: "HOAs",
        href: "/workforce/hoas",
        icon: TrendingUp,
        roles: ["ADMIN"]
      },
      {
        title: "Trainers",
        href: "/workforce/trainers",
        icon: GraduationCap,
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
        roles: ["TRAINER", "SUPER_TRAINER", "ADMIN", "HOA", "SALES_MANAGER"]
      },
      {
        title: "Attendance",
        href: "/trainings/attendance",
        icon: Calendar,
        roles: ["TRAINER", "SUPER_TRAINER", "ADMIN"]
      },
      {
        title: "My Trainings",
        href: "/trainings",
        icon: GraduationCap,
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
        roles: ["HOA", "SALES_MANAGER", "TRAINER", "SUPER_TRAINER", "ADMIN"]
      },
      {
        title: "My Training Report",
        href: "/reports",
        icon: TrendingUp,
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
        roles: ["ADMIN"]
      }
    ],
    roles: ["ADMIN"]
  }
];

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
