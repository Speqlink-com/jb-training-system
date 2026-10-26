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

interface WorkspaceAction { title: string; href: string; icon: LucideIcon }

const actionsByRole: Record<Role, WorkspaceAction[]> = {
  [Role.ADMIN]: [
    { title: "Manage users", href: "/users", icon: Users },
    { title: "Training programmes", href: "/trainings", icon: GraduationCap },
    { title: "Attendance register", href: "/trainings/attendance", icon: ScanLine },
  ],
  [Role.HOA]: [{ title: "Training programmes", href: "/trainings", icon: GraduationCap }],
  [Role.SALES_MANAGER]: [{ title: "Training programmes", href: "/trainings", icon: GraduationCap }],
  [Role.TRAINER]: [
    { title: "Training programmes", href: "/trainings", icon: GraduationCap },
    { title: "Attendance register", href: "/trainings/attendance", icon: ScanLine },
    { title: "Training reports", href: "/reports", icon: FileText },
  ],
  [Role.SUPER_TRAINER]: [
    { title: "Training programmes", href: "/trainings", icon: GraduationCap },
    { title: "Attendance register", href: "/trainings/attendance", icon: ScanLine },
    { title: "Training reports", href: "/reports", icon: FileText },
  ],
  [Role.AGENT]: [{ title: "My training", href: "/trainings", icon: GraduationCap }],
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
    ...(userCount !== null ? [{ title: "Users", value: String(userCount), icon: Users }] : []),
    { title: "Programmes", value: String(trainings.length), icon: GraduationCap },
    { title: "Scheduled", value: String(scheduled), icon: Calendar },
    { title: "Registrations", value: String(registrations), icon: UserCheck },
    { title: "Attendance", value: String(attendance), icon: CheckCircle },
  ].slice(0, 4);
  const nextAssignedTraining = trainings.find((training) => training.attendanceOpen && training.status !== "COMPLETED");

  return <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-11">
    <header className="mb-8 flex items-start justify-between gap-4"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a90024]">{user.role.replaceAll("_", " ")}</p><h1 className="text-4xl font-bold tracking-[-0.045em] text-[#171d25] sm:text-5xl">Dashboard</h1></div><div className="hidden h-11 w-11 place-items-center rounded-full bg-[#f5dde2] text-sm font-bold text-[#85001c] sm:grid">{user.firstName.charAt(0)}</div></header>

    {nextAssignedTraining && <section className="mb-8 flex flex-col gap-5 rounded-xl border border-[#e6b9c2] bg-[linear-gradient(115deg,#780019,#a90024)] p-6 text-white shadow-[0_14px_32px_rgba(169,0,36,0.14)] sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/15"><ScanLine className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/70">Attendance</p><h2 className="mt-1 text-lg font-semibold">{nextAssignedTraining.title}</h2></div></div><Link href={getCheckInPath(nextAssignedTraining.publicCode)} className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-[#780019] transition hover:bg-[#fbeaec]">Open check-in</Link></section>}

    {loading ? <div className="grid min-h-40 place-items-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /></div> : <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace statistics">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</section>}

    <section className="mt-10"><h2 className="mb-4 text-2xl font-semibold tracking-[-0.025em] text-[#171d25]">Quick access</h2><div className="grid grid-cols-1 gap-4 lg:grid-cols-3">{actionsByRole[user.role].map((action) => <Link key={action.title} href={action.href} className="group relative min-h-36 rounded-xl border border-[#dce1e3] bg-white p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d9a1ad] hover:shadow-md"><action.icon className="h-5 w-5 text-[#a90024]" /><ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-slate-400 transition group-hover:text-[#a90024]" /><h3 className="mt-10 text-lg font-semibold tracking-tight">{action.title}</h3></Link>)}</div></section>

    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-semibold tracking-[-0.025em] text-[#171d25]">Latest programmes</h2>
      <div className="rounded-xl border border-[#dce1e3] bg-white px-5 shadow-sm">
        {trainings.slice(0, 5).map((training, index) => <div key={training.id} className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-center ${index > 0 ? "border-t border-slate-100" : ""}`}>
          <div className="flex min-w-0 flex-1 items-center gap-4"><span className="h-2 w-2 shrink-0 rounded-full bg-[#a90024] ring-4 ring-[#a90024]/10" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{training.title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{training.registrationCount} joined · {training.attendanceCount} present</p></div></div>
          {user.role === Role.ADMIN && <div className="flex flex-wrap items-center gap-2">
            {/^https?:\/\//i.test(training.location) && <button type="button" onClick={() => void copyValue(training.location, `meeting:${training.id}`)} className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-[#a90024] hover:text-[#a90024]"><Copy className="mr-1.5 h-3.5 w-3.5" />{copiedKey === `meeting:${training.id}` ? "Copied" : "Copy meeting URL"}</button>}
            <button type="button" onClick={() => void copyValue(`${window.location.origin}${getCheckInPath(training.publicCode)}`, `join:${training.id}`)} className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-[#a90024] hover:text-[#a90024]"><Copy className="mr-1.5 h-3.5 w-3.5" />{copiedKey === `join:${training.id}` ? "Copied" : "Copy join URL"}</button>
          </div>}
          <time className="shrink-0 text-xs text-slate-400">{new Date(training.scheduledAt).toLocaleDateString("en-KE")}</time>
        </div>)}
        {trainings.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No training activity has been recorded.</p>}
      </div>
    </section>
  </div>;
}

export default function DashboardPage() { return <ProtectedRoute><DashboardShell><DashboardContent /><NotificationPanel /></DashboardShell></ProtectedRoute>; }
