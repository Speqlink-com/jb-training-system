"use client";

import { UserCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Permission } from "@/config/permissions";

export default function OnboardingPage() {
  return <ProtectedRoute requiredPermissions={[Permission.ONBOARDING_READ]}><DashboardShell><div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8"><p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">Workforce operations</p><h1 className="mt-2 text-4xl font-bold text-slate-900">Onboarding</h1><div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm"><UserCheck className="mx-auto h-9 w-9 text-slate-300" /><h2 className="mt-4 text-lg font-semibold text-slate-800">No onboarding records</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">No persistent onboarding data source is configured yet, so this screen does not invent candidate records.</p></div></div><NotificationPanel /></DashboardShell></ProtectedRoute>;
}
