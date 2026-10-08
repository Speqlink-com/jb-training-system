"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, GraduationCap, Loader2, UserPlus, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Permission } from "@/config/permissions";
import { listTrainings, type TrainingProgram } from "@/lib/training-api";
import { Card, CardContent } from "@/components/ui/card";

function ReportsWorkspace() {
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const load = async () => {
      try { setTrainings(await listTrainings()); }
      catch (caught) { setError(caught instanceof Error ? caught.message : "Reports could not be loaded"); }
      finally { setLoading(false); }
    };
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const joins = trainings.reduce((sum, training) => sum + training.registrationCount, 0);
  const attendance = trainings.reduce((sum, training) => sum + training.attendanceCount, 0);
  const rate = joins ? Math.round((attendance / joins) * 100) : 0;
  return <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8 lg:px-12 lg:py-10"><header><p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">Live reporting</p><h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-[#171d25]">Training reports</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">These figures are calculated from PostgreSQL programmes and verified QR attendance—no sample analytics.</p></header>{error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}{loading ? <div className="grid min-h-56 place-items-center rounded-xl border border-slate-200 bg-white"><Loader2 className="h-5 w-5 animate-spin text-slate-500" /></div> : <><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Summary icon={GraduationCap} label="Programmes" value={trainings.length} /><Summary icon={UserPlus} label="Programme joins" value={joins} /><Summary icon={CheckCircle2} label="Verified attendance" value={attendance} /><Summary icon={Users} label="Attendance rate" value={`${rate}%`} /></section><section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 bg-white p-5"><h2 className="font-semibold text-slate-900">Programme performance</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Programme</th><th className="px-5 py-3">Trainer</th><th className="px-5 py-3">Scheduled</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Present</th></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{trainings.map((training) => <tr key={training.id}><td className="px-5 py-4 font-semibold text-slate-900">{training.title}</td><td className="px-5 py-4 text-slate-600">{training.trainerName}</td><td className="px-5 py-4 text-slate-600">{new Date(training.scheduledAt).toLocaleDateString("en-KE")}</td><td className="px-5 py-4">{training.registrationCount}</td><td className="px-5 py-4">{training.attendanceCount}</td></tr>)}{trainings.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-500">No programme data has been recorded.</td></tr>}</tbody></table></div></section></>}</div>;
}

function Summary({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) { return <Card className="bg-white"><CardContent className="p-5"><Icon className="h-5 w-5 text-[#9b1b36]" /><p className="mt-4 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></CardContent></Card>; }

export default function ReportsPage() { return <ProtectedRoute requiredPermissions={[Permission.REPORTS_READ]}><DashboardShell><ReportsWorkspace /><NotificationPanel /></DashboardShell></ProtectedRoute>; }
