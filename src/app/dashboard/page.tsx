"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Calendar, CheckCircle, Copy, FileText, GraduationCap, Loader2, ScanLine, UserCheck, Users } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { Role } from "@/config/permissions";
import { getCheckInPath, listTrainings, type TrainingProgram } from "@/lib/training-api";
import { listUsers } from "@/lib/user-api";
import { copyText } from "@/lib/copy-text";

interface WorkspaceAction { title: string; description: string; href: string; icon: LucideIcon }

const roleDescriptions: Record<Role, string> = {
  [Role.ADMIN]: "Monitor real platform accounts, programmes, and verified attendance.",
  [Role.HOA]: "Review the training programmes available to agency leadership.",
  [Role.SALES_MANAGER]: "Review training programmes available to your role.",
  [Role.TRAINER]: "Coordinate your assigned programmes and verified attendance.",
  [Role.AGENT]: "Join assigned learning programmes and record attendance.",
};

const actionsByRole: Record<Role, WorkspaceAction[]> = {
  [Role.ADMIN]: [
    { title: "Manage users", description: "Create real accounts and control access.", href: "/users", icon: Users },
    { title: "Training programmes", description: "Assign trainers and publish QR links.", href: "/trainings", icon: GraduationCap },
    { title: "Attendance console", description: "Review and export verified records.", href: "/trainings/attendance", icon: ScanLine },
  ],
  [Role.HOA]: [{ title: "Training programmes", description: "Open programmes assigned to your role.", href: "/trainings", icon: GraduationCap }],
  [Role.SALES_MANAGER]: [{ title: "Training programmes", description: "Open programmes assigned to your role.", href: "/trainings", icon: GraduationCap }],
  [Role.TRAINER]: [
    { title: "Training programmes", description: "Schedule and manage your sessions.", href: "/trainings", icon: GraduationCap },
    { title: "Attendance console", description: "Monitor QR check-ins and export registers.", href: "/trainings/attendance", icon: ScanLine },
    { title: "Training reports", description: "Review real programme outcomes.", href: "/reports", icon: FileText },
  ],
  [Role.AGENT]: [{ title: "My training", description: "Open programmes assigned to agents.", href: "/trainings", icon: GraduationCap }],
};

function DashboardContent() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState("");

  const copyValue = async (value: string, key: string) => {
    if (!await copyText(value)) return;
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((current) => current === key ? "" : current), 2000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [programmes, users] = await Promise.all([
          listTrainings(),
          user?.role === Role.ADMIN ? listUsers({ activeOnly: false }) : Promise.resolve(null),
        ]);
        setTrainings(programmes);
        setUserCount(users?.total ?? null);
      } finally {
        setLoading(false);
      }
    };
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [user?.role]);

  if (!user) return null;
  const scheduled = trainings.filter((item) => item.status === "SCHEDULED").length;
  const registrations = trainings.reduce((sum, item) => sum + item.registrationCount, 0);
  const attendance = trainings.reduce((sum, item) => sum + item.attendanceCount, 0);
  const stats = [
    ...(userCount !== null ? [{ title: "Real users", value: String(userCount), description: "PostgreSQL accounts", icon: Users }] : []),
    { title: "Programmes", value: String(trainings.length), description: "Visible to your role", icon: GraduationCap },
    { title: "Scheduled", value: String(scheduled), description: "Upcoming programmes", icon: Calendar },
    { title: "Programme joins", value: String(registrations), description: "QR registrations", icon: UserCheck },
    { title: "Attendance", value: String(attendance), description: "Verified check-ins", icon: CheckCircle },
  ].slice(0, 4);
  const nextAssignedTraining = trainings.find((training) => training.attendanceOpen && training.status !== "COMPLETED");

  return <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-11">
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b1b36]">{user.role.replaceAll("_", " ")} workspace</p><h1 className="text-4xl font-bold tracking-[-0.045em] text-[#171d25] sm:text-5xl">Dashboard</h1><p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">Welcome back, {user.firstName}. {roleDescriptions[user.role]}</p></div><div className="hidden h-11 w-11 place-items-center rounded-full bg-[#f1dfe3] text-sm font-bold text-[#7b172e] sm:grid">{user.firstName.charAt(0)}</div></header>

    {nextAssignedTraining && <section className="mb-8 flex flex-col gap-5 rounded-xl border border-[#d6b8bf] bg-[linear-gradient(115deg,#641329,#8f1933)] p-6 text-white shadow-[0_14px_32px_rgba(100,19,41,0.14)] sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/15"><ScanLine className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/70">Ready for QR attendance</p><h2 className="mt-1 text-lg font-semibold">{nextAssignedTraining.title}</h2><p className="mt-1 text-sm text-white/75">Open the real programme check-in form.</p></div></div><Link href={getCheckInPath(nextAssignedTraining.publicCode)} className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-[#641329] transition hover:bg-[#f7ecef]">Open check-in</Link></section>}

    {loading ? <div className="grid min-h-40 place-items-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /></div> : <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace statistics">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</section>}

    <section className="mt-10"><div className="mb-4"><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b1b36]">Quick access</p><h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#171d25]">Continue your work</h2></div><div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{actionsByRole[user.role].map((action) => <Link key={action.title} href={action.href} className="group relative min-h-48 rounded-xl border border-[#dce1e3] bg-white p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b9a0a6] hover:shadow-md"><action.icon className="h-5 w-5 text-[#9b1b36]" /><ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-slate-400 transition group-hover:text-[#9b1b36]" /><h3 className="mt-12 text-lg font-semibold tracking-tight">{action.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p></Link>)}</div></section>

    <section className="mt-10">
      <div className="mb-4"><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b1b36]">Latest programmes</p><h2 className="text-2xl font-semibold tracking-[-0.025em] text-[#171d25]">Real training activity</h2></div>
      <div className="rounded-xl border border-[#dce1e3] bg-white px-5 shadow-sm">
        {trainings.slice(0, 5).map((training, index) => <div key={training.id} className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-center ${index > 0 ? "border-t border-slate-100" : ""}`}>
          <div className="flex min-w-0 flex-1 items-center gap-4"><span className="h-2 w-2 shrink-0 rounded-full bg-[#9b1b36] ring-4 ring-[#9b1b36]/10" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{training.title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{training.registrationCount} joined · {training.attendanceCount} present</p></div></div>
          {user.role === Role.ADMIN && <div className="flex flex-wrap items-center gap-2">
            {/^https?:\/\//i.test(training.location) && <button type="button" onClick={() => void copyValue(training.location, `meeting:${training.id}`)} className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-[#9b1b36] hover:text-[#9b1b36]"><Copy className="mr-1.5 h-3.5 w-3.5" />{copiedKey === `meeting:${training.id}` ? "Copied" : "Copy meeting URL"}</button>}
            <button type="button" onClick={() => void copyValue(`${window.location.origin}${getCheckInPath(training.publicCode)}`, `join:${training.id}`)} className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-[#9b1b36] hover:text-[#9b1b36]"><Copy className="mr-1.5 h-3.5 w-3.5" />{copiedKey === `join:${training.id}` ? "Copied" : "Copy join URL"}</button>
          </div>}
          <time className="shrink-0 text-xs text-slate-400">{new Date(training.scheduledAt).toLocaleDateString("en-KE")}</time>
        </div>)}
        {trainings.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No training activity has been recorded.</p>}
      </div>
    </section>
  </div>;
}

export default function DashboardPage() { return <ProtectedRoute><DashboardShell><DashboardContent /><NotificationPanel /></DashboardShell></ProtectedRoute>; }
