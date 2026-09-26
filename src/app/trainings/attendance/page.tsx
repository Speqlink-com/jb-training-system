"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ExcelExportButton } from "@/components/common/excel-export-button";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Role } from "@/config/permissions";
import type { ExcelExportColumn } from "@/lib/export/excel";
import {
  getAttendance,
  getTrainings,
  PLATFORM_CHANGE_EVENT,
  type AttendanceRecord,
  type LocalTraining,
} from "@/lib/local-platform";
import { Input } from "@/components/ui/input";

type ExportRow = AttendanceRecord & { training: string; scheduledAt: string; location: string };
const columns: ExcelExportColumn<ExportRow>[] = [
  { header: "Programme", value: (row) => row.training, width: 34 },
  { header: "Participant", value: (row) => row.attendeeName, width: 24 },
  { header: "Email", value: (row) => row.attendeeEmail, width: 30 },
  { header: "Role", value: (row) => row.role.replaceAll("_", " "), width: 20 },
  { header: "Training date", value: (row) => new Date(row.scheduledAt), width: 20, numberFormat: "dd-mmm-yyyy hh:mm" },
  { header: "Checked in", value: (row) => new Date(row.checkedInAt), width: 20, numberFormat: "dd-mmm-yyyy hh:mm:ss" },
  { header: "Location", value: (row) => row.location, width: 34 },
  { header: "Source", value: (row) => row.source, width: 12 },
];

function AttendanceWorkspace() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [trainings, setTrainings] = useState<LocalTraining[]>([]);
  const [query, setQuery] = useState("");
  const refresh = () => { setAttendance(getAttendance()); setTrainings(getTrainings()); };
  useEffect(() => { const timer = window.setTimeout(refresh, 0); window.addEventListener(PLATFORM_CHANGE_EVENT, refresh); window.addEventListener("storage", refresh); return () => { window.clearTimeout(timer); window.removeEventListener(PLATFORM_CHANGE_EVENT, refresh); window.removeEventListener("storage", refresh); }; }, []);
  const rows = useMemo<ExportRow[]>(() => attendance.map((item) => {
    const training = trainings.find((candidate) => candidate.id === item.trainingId);
    return { ...item, training: training?.title || "Unknown programme", scheduledAt: training?.scheduledAt || item.checkedInAt, location: training?.location || "—" };
  }), [attendance, trainings]);
  const filtered = rows.filter((row) => [row.training, row.attendeeName, row.attendeeEmail, row.role].join(" ").toLowerCase().includes(query.toLowerCase()));
  return <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8 lg:px-12 lg:py-10"><header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">Learning operations · Verified records</p><h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-[#171d25]">Attendance console</h1><p className="mt-3 text-sm text-slate-500">Every row is tied to a signed-in user and captured once per programme.</p></div><ExcelExportButton columns={columns} rows={filtered} fileName="jubilee-training-attendance" sheetName="Attendance" title="Jubilee verified training attendance" label="Download attendance" /></header><section className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-[#dce1e3] bg-white p-5"><Users className="h-5 w-5 text-[#9b1b36]" /><p className="mt-4 text-3xl font-bold">{attendance.length}</p><p className="mt-1 text-sm text-slate-500">Verified check-ins</p></div><div className="rounded-xl border border-[#dce1e3] bg-white p-5"><CheckCircle2 className="h-5 w-5 text-[#9b1b36]" /><p className="mt-4 text-3xl font-bold">{new Set(attendance.map((item) => item.userId)).size}</p><p className="mt-1 text-sm text-slate-500">Unique participants</p></div></section><section className="overflow-hidden rounded-xl border border-[#dce1e3] bg-white"><div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-900">Attendance register</h2><p className="mt-1 text-xs text-slate-500">Export respects the current search.</p></div><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search attendance" /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#f8f9fa] text-[10px] uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-5 py-3">Participant</th><th className="px-5 py-3">Programme</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Checked in</th><th className="px-5 py-3">Verification</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((row) => <tr key={row.id}><td className="px-5 py-4"><p className="font-semibold text-slate-900">{row.attendeeName}</p><p className="mt-1 text-xs text-slate-500">{row.attendeeEmail}</p></td><td className="px-5 py-4"><p className="font-medium">{row.training}</p><p className="mt-1 text-xs text-slate-500">{row.location}</p></td><td className="px-5 py-4">{row.role.replaceAll("_", " ")}</td><td className="px-5 py-4">{new Date(row.checkedInAt).toLocaleString("en-KE")}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />QR verified</span></td></tr>)}{filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-500">No attendance has been recorded in this browser yet.</td></tr>}</tbody></table></div></section></div>;
}

export default function AttendancePage() { return <ProtectedRoute requiredRoles={[Role.ADMIN, Role.TRAINER]}><DashboardShell><AttendanceWorkspace /><NotificationPanel /></DashboardShell></ProtectedRoute>; }
