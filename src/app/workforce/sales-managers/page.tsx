"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { UserDirectory } from "@/components/workforce/user-directory";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Role } from "@/config/permissions";

export default function SalesManagersPage() {
  return <ProtectedRoute requiredRoles={[Role.ADMIN]}><DashboardShell><UserDirectory role="SALES_MANAGER" eyebrow="Administration · Leadership" title="Sales managers" description="Manage real sales-manager accounts, assignments, invitations, and access." /><NotificationPanel /></DashboardShell></ProtectedRoute>;
}
