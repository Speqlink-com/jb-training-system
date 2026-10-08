"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { UserDirectory } from "@/components/workforce/user-directory";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Role } from "@/config/permissions";

export default function UsersPage() {
  return <ProtectedRoute requiredRoles={[Role.ADMIN]}><DashboardShell><UserDirectory eyebrow="Administration · Access control" title="All users" description="Create and manage every real platform account from one directory." /><NotificationPanel /></DashboardShell></ProtectedRoute>;
}
