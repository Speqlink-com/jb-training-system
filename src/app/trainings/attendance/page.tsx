"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, Download, Loader2, Search, UserPlus, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Role } from "@/config/permissions";
import { ApiError } from "@/lib/api/client";
import { downloadAttendanceExport, listAttendance, listTrainings, PARTICIPANT_ROLE_LABELS, type AttendanceRow, type TrainingProgram } from "@/lib/training-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AttendanceWorkspace() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [query, setQuery] = useState("");
  const [programme, setProgramme] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [attendance, programmes] = await Promise.all([listAttendance(), listTrainings()]);
      setRows(attendance);
      setTrainings(programmes);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The attendance register could not be loaded");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = rows.filter((row) => {
    const matchesProgramme = programme === "all" || row.trainingId === programme;
    const matchesQuery = !normalizedQuery || [row.trainingTitle, row.participantName, row.participantCode, row.email, row.phone, PARTICIPANT_ROLE_LABELS[row.role]].join(" ").toLowerCase().includes(normalizedQuery);
    return matchesProgramme && matchesQuery;
  });
  const presentCount = rows.filter((row) => row.attendanceStatus === "PRESENT").length;

  const download = async () => {
    setExporting(true);
    setError("");
    try {
      await downloadAttendanceExport({ trainingId: programme === "all" ? undefined : programme, search: query });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The Excel register could not be downloaded");
    } finally {
      setExporting(false);
    }
  };

  return <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">Learning operations · Participant register</p><h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-[#171d25]">Attendance console</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Review everyone who joined through a programme link, distinguish present participants, and export the complete filtered register.</p></div><Button onClick={() => void download()} disabled={exporting} className="bg-[#9b1b36] hover:bg-[#7b172e]">{exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Download Excel register</Button></header>

    {error && <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void refresh()}>Try again</Button></div>}

    <section className="grid gap-4 sm:grid-cols-3">
      <SummaryCard icon={UserPlus} label="Programme joins" value={rows.length} note="All registered participants" />
      <SummaryCard icon={CheckCircle2} label="Marked present" value={presentCount} note="Confirmed attendance" />
      <SummaryCard icon={Clock3} label="Awaiting attendance" value={rows.length - presentCount} note="Joined but not marked present" />
    </section>

    <section className="overflow-hidden rounded-xl border border-[#dce1e3] bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-semibold text-slate-900">Programme register</h2><p className="mt-1 text-xs text-slate-500">The server-generated Excel download respects both filters below.</p></div><div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"><select value={programme} onChange={(event) => setProgramme(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 sm:w-64"><option value="all">All programmes</option>{trainings.map((training) => <option key={training.id} value={training.id}>{training.title}</option>)}</select><div className="relative sm:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Name, code, role or email" /></div></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-[#f8f9fa] text-[10px] uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-5 py-3">Participant</th><th className="px-5 py-3">Role & code</th><th className="px-5 py-3">Programme</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Attendance</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-500"><span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading attendance register</span></td></tr> : filtered.map((row) => <tr key={row.registrationId} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-semibold text-slate-900">{row.participantName}</p><p className="mt-1 text-xs text-slate-500">{row.email || row.phone || "No contact supplied"}</p></td><td className="px-5 py-4"><p className="font-medium text-slate-700">{PARTICIPANT_ROLE_LABELS[row.role]}</p><p className="mt-1 font-mono text-xs text-slate-500">{row.participantCode}</p></td><td className="px-5 py-4"><p className="font-medium">{row.trainingTitle}</p><p className="mt-1 text-xs text-slate-500">{row.location}</p></td><td className="px-5 py-4 text-slate-600">{new Date(row.joinedAt).toLocaleString("en-KE")}</td><td className="px-5 py-4">{row.attendanceStatus === "PRESENT" ? <div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Present</span><p className="mt-1 text-xs text-slate-400">{row.checkedInAt ? new Date(row.checkedInAt).toLocaleString("en-KE") : ""}</p></div> : <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><Clock3 className="h-3.5 w-3.5" />Joined · awaiting attendance</span>}</td></tr>)}{!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-500">No participants match the current filters.</td></tr>}</tbody></table></div>
    </section>
  </div>;
}

function SummaryCard({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: number; note: string }) { return <div className="rounded-xl border border-[#dce1e3] bg-white p-5"><Icon className="h-5 w-5 text-[#9b1b36]" /><p className="mt-4 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-sm font-medium text-slate-600">{label}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>; }

export default function AttendancePage() { return <ProtectedRoute requiredRoles={[Role.ADMIN, Role.TRAINER]}><DashboardShell><AttendanceWorkspace /><NotificationPanel /></DashboardShell></ProtectedRoute>; }
