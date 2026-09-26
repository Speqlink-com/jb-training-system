"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  FileText,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
  ScanLine,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { Role } from "@/config/permissions";
import { canAttend, getCheckInPath, getTrainings, PLATFORM_CHANGE_EVENT, type LocalTraining } from "@/lib/local-platform";

interface WorkspaceAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const roleDescriptions: Record<Role, string> = {
  [Role.ADMIN]: "Monitor platform activity, people, learning, and compliance.",
  [Role.HOA]: "Review agency performance, leadership, and workforce readiness.",
  [Role.SALES_MANAGER]: "Manage your team, onboarding pipeline, and training progress.",
  [Role.TRAINER]: "Coordinate learning programmes, attendance, and training outcomes.",
  [Role.AGENT]: "Continue your learning and review your performance progress.",
};

const actionsByRole: Record<Role, WorkspaceAction[]> = {
  [Role.ADMIN]: [
    { title: "Control trainers", description: "Manage trainer access and programme ownership.", href: "/workforce/trainers", icon: Users },
    { title: "Training programmes", description: "Plan sessions and monitor completion.", href: "/trainings", icon: GraduationCap },
    { title: "Attendance console", description: "Review QR check-ins and export verified records.", href: "/trainings/attendance", icon: ScanLine },
  ],
  [Role.HOA]: [
    { title: "Agency workforce", description: "Review agents across your branches.", href: "/agents", icon: Users },
    { title: "Sales managers", description: "Track leadership and team performance.", href: "/workforce/sales-managers", icon: UserCheck },
    { title: "Performance reports", description: "Open agency and training analytics.", href: "/reports", icon: BarChart3 },
  ],
  [Role.SALES_MANAGER]: [
    { title: "My agents", description: "Review team readiness and compliance.", href: "/agents", icon: Users },
    { title: "Onboarding pipeline", description: "Continue candidate reviews and placement.", href: "/onboarding", icon: UserCheck },
    { title: "Team reports", description: "Inspect production and learning outcomes.", href: "/reports", icon: BarChart3 },
  ],
  [Role.TRAINER]: [
    { title: "Training programmes", description: "Schedule and manage learning sessions.", href: "/trainings", icon: GraduationCap },
    { title: "Attendance console", description: "Monitor QR check-ins and export the register.", href: "/trainings/attendance", icon: ScanLine },
    { title: "Training reports", description: "Review attendance and programme outcomes.", href: "/reports", icon: FileText },
  ],
  [Role.AGENT]: [
    { title: "My training", description: "Open assigned and completed programmes.", href: "/trainings", icon: GraduationCap },
    { title: "My performance", description: "Review progress and production indicators.", href: "/reports", icon: TrendingUp },
    { title: "Learning status", description: "Check compliance and outstanding actions.", href: "/dashboard", icon: CheckCircle },
  ],
};

function DashboardContent() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<LocalTraining[]>([]);

  useEffect(() => {
    const refresh = () => setTrainings(getTrainings());
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(PLATFORM_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(PLATFORM_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!user) return null;

  const getRoleBasedStats = () => {
    switch (user.role) {
      case Role.AGENT:
        return [
          { title: "My trainings", value: "5", description: "Completed this month", icon: GraduationCap, trend: { value: 2, isPositive: true } },
          { title: "Pending trainings", value: "2", description: "Require action", icon: Calendar },
          { title: "Compliance", value: "89%", description: "Training completion", icon: CheckCircle, trend: { value: 5, isPositive: true } },
          { title: "My production", value: "KES 4.8M", description: "Current month", icon: TrendingUp, trend: { value: 12, isPositive: true } },
        ];
      case Role.SALES_MANAGER:
        return [
          { title: "My agents", value: "48", description: "Under management", icon: Users, trend: { value: 3, isPositive: true } },
          { title: "Team production", value: "KES 31.4M", description: "Current month", icon: TrendingUp, trend: { value: 8, isPositive: true } },
          { title: "Training compliance", value: "94%", description: "Team average", icon: CheckCircle, trend: { value: 2, isPositive: true } },
          { title: "Pending trainings", value: "8", description: "Across the team", icon: Calendar },
        ];
      case Role.HOA:
        return [
          { title: "Total agents", value: "243", description: "Across all branches", icon: Users, trend: { value: 12, isPositive: true } },
          { title: "Sales managers", value: "12", description: "Under supervision", icon: UserCheck },
          { title: "Monthly production", value: "KES 182M", description: "Agency total", icon: TrendingUp, trend: { value: 15, isPositive: true } },
          { title: "Compliance", value: "96%", description: "Agency average", icon: CheckCircle, trend: { value: 1, isPositive: true } },
        ];
      case Role.TRAINER:
        return [
          { title: "Total manpower", value: "1,284", description: "Agents in scope", icon: Users },
          { title: "Sessions conducted", value: "48", description: "Current month", icon: GraduationCap, trend: { value: 6, isPositive: true } },
          { title: "Upcoming sessions", value: "7", description: "This week", icon: Calendar },
          { title: "Pending reports", value: "3", description: "Require completion", icon: FileText },
        ];
      case Role.ADMIN:
        return [
          { title: "Total users", value: "3,482", description: "Across all roles", icon: Users, trend: { value: 45, isPositive: true } },
          { title: "Training sessions", value: "1,284", description: "Total conducted", icon: GraduationCap, trend: { value: 18, isPositive: true } },
          { title: "System compliance", value: "94.7%", description: "Overall rate", icon: CheckCircle, trend: { value: 2.3, isPositive: true } },
          { title: "Active alerts", value: "12", description: "Require attention", icon: Bell },
        ];
    }
  };

  const stats = getRoleBasedStats();
  const actions = actionsByRole[user.role];
  const nextAssignedTraining = trainings.find((training) => canAttend(training, user) && training.status !== "COMPLETED");

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-11">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b1b36]">
            {user.role.replaceAll("_", " ")} workspace
          </p>
          <h1 className="text-4xl font-bold tracking-[-0.045em] text-[#171d25] sm:text-5xl">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
            Welcome back, {user.firstName}. {roleDescriptions[user.role]}
          </p>
        </div>
        <div className="hidden h-11 w-11 place-items-center rounded-full bg-[#f1dfe3] text-sm font-bold text-[#7b172e] sm:grid">
          {user.firstName.charAt(0)}
        </div>
      </header>

      {nextAssignedTraining && (
        <section className="mb-8 flex flex-col gap-5 rounded-xl border border-[#d6b8bf] bg-[linear-gradient(115deg,#641329,#8f1933)] p-6 text-white shadow-[0_14px_32px_rgba(100,19,41,0.14)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/12"><ScanLine className="h-5 w-5" /></span>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/55">Ready for QR attendance</p><h2 className="mt-1 text-lg font-semibold">{nextAssignedTraining.title}</h2><p className="mt-1 text-sm text-white/65">Open the attendance screen after scanning the programme QR.</p></div>
          </div>
          <Link href={getCheckInPath(nextAssignedTraining.id)} className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-[#641329] transition hover:bg-[#f7ecef]">Open check-in</Link>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace statistics">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b1b36]">Quick access</p>
          <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#171d25]">Continue your work</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group relative min-h-48 rounded-xl border border-[#dce1e3] bg-white p-6 text-slate-900 shadow-[0_1px_2px_rgba(20,30,34,0.025)] transition hover:-translate-y-0.5 hover:border-[#b9a0a6] hover:shadow-md"
            >
              <action.icon className="h-5 w-5 text-[#9b1b36]" />
              <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-slate-400 transition group-hover:text-[#9b1b36]" />
              <h3 className="mt-12 text-lg font-semibold tracking-tight">{action.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b1b36]">Operations</p>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#171d25]">Recent activity</h2>
          </div>
          <Link href="/reports" className="text-xs font-semibold text-[#9b1b36] hover:underline">Open reports</Link>
        </div>
        <div className="rounded-xl border border-[#dce1e3] bg-white px-5 shadow-[0_1px_2px_rgba(20,30,34,0.025)]">
          {[
            ["Training completed", "AML Compliance Training", "2h ago"],
            ["Agent onboarding updated", "John Kamau · AGT-001234", "4h ago"],
            ["Training reminder", "Product Training scheduled for tomorrow", "1d ago"],
          ].map(([title, detail, time], index) => (
            <div key={title} className={`flex items-center gap-4 py-4 ${index > 0 ? "border-t border-slate-100" : ""}`}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#9b1b36] ring-4 ring-[#9b1b36]/8" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{detail}</p>
              </div>
              <time className="shrink-0 text-xs text-slate-400">{time}</time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <DashboardContent />
        <NotificationPanel />
      </DashboardShell>
    </ProtectedRoute>
  );
}
