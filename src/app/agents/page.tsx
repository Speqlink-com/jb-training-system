"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { UserDirectory } from "@/components/workforce/user-directory";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Role } from "@/config/permissions";

export default function AgentsPage() {
  return <ProtectedRoute requiredRoles={[Role.ADMIN]}><DashboardShell><UserDirectory role="AGENT" eyebrow="Administration · Workforce" title="Agents" description="Manage real agent login accounts and access without fabricated production or compliance figures." /><NotificationPanel /></DashboardShell></ProtectedRoute>;
}
