"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { UserDirectory } from "@/components/workforce/user-directory";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Role } from "@/config/permissions";

export default function TrainersPage() {
  return <ProtectedRoute requiredRoles={[Role.ADMIN]}><DashboardShell><UserDirectory role="TRAINER" eyebrow="Administration · People" title="Trainer control centre" description="Create trainer accounts, email first-login credentials, and control access from PostgreSQL-backed records." /><NotificationPanel /></DashboardShell></ProtectedRoute>;
}
