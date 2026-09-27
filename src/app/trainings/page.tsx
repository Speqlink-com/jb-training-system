"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import { CalendarDays, CheckCircle2, Clock3, GraduationCap, MapPin, Plus, QrCode, ScanLine, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ExcelExportButton } from "@/components/common/excel-export-button";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Permission, Role } from "@/config/permissions";
import { useAuth } from "@/lib/auth/auth-context";
import type { ExcelExportColumn } from "@/lib/export/excel";
import {
  attendanceForTraining,
  canAttend,
  getCheckInPath,
  getTrainers,
  getTrainings,
  PLATFORM_CHANGE_EVENT,
  registrationsForTraining,
  saveTrainings,
  trainerName,
  type LocalTrainer,
  type LocalTraining,
} from "@/lib/local-platform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type TrainingExportRow = LocalTraining & { trainer: string; registrations: number; attendance: number };
const columns: ExcelExportColumn<TrainingExportRow>[] = [
  { header: "Programme", value: (row) => row.title, width: 34 },
  { header: "Trainer", value: (row) => row.trainer, width: 24 },
  { header: "Scheduled", value: (row) => new Date(row.scheduledAt), width: 20, numberFormat: "dd-mmm-yyyy hh:mm" },
  { header: "Location", value: (row) => row.location, width: 34 },
  { header: "Audience", value: (row) => row.audienceRoles.join(", "), width: 32 },
  { header: "Capacity", value: (row) => row.capacity, width: 13 },
  { header: "Registered", value: (row) => row.registrations, width: 15 },
  { header: "Attendance", value: (row) => row.attendance, width: 15 },
  { header: "Status", value: (row) => row.status, width: 16 },
];

function TrainingsWorkspace() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<LocalTraining[]>([]);
  const [trainers, setTrainers] = useState<LocalTrainer[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [qrTraining, setQrTraining] = useState<LocalTraining | null>(null);

  const refresh = () => { setTrainings(getTrainings()); setTrainers(getTrainers()); };
  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(PLATFORM_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener(PLATFORM_CHANGE_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);

  const rows = useMemo<TrainingExportRow[]>(() => trainings.map((training) => ({
    ...training,
    trainer: trainerName(training.trainerId, trainers),
    registrations: registrationsForTraining(training.id).length,
    attendance: attendanceForTraining(training.id).length,
  })), [trainings, trainers]);
  const canManage = user?.role === Role.ADMIN || user?.role === Role.TRAINER;
  const relevant = user && !canManage ? trainings.filter((training) => canAttend(training, user)) : trainings;
  const attendeeTotal = rows.reduce((sum, row) => sum + row.attendance, 0);

  return <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">Learning operations</p><h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-[#171d25]">Training programmes</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Schedule learning and share a public QR link where any participant can join using their role and unique code, then mark attendance.</p></div><div className="flex flex-wrap gap-2">{canManage && <><ExcelExportButton columns={columns} rows={rows} fileName="jubilee-training-programmes" sheetName="Programmes" title="Jubilee training programmes" /><Button asChild variant="outline"><Link href="/trainings/attendance"><Users className="mr-2 h-4 w-4" />Attendance console</Link></Button><Button onClick={() => setCreateOpen(true)} className="bg-[#9b1b36] hover:bg-[#7b172e]"><Plus className="mr-2 h-4 w-4" />New programme</Button></>}</div></header>

    <section className="grid gap-4 sm:grid-cols-3">{[
      { label: "Programmes", value: relevant.length, icon: GraduationCap },
      { label: "Open for check-in", value: relevant.filter((item) => item.status !== "COMPLETED").length, icon: ScanLine },
      { label: "Recorded attendance", value: attendeeTotal, icon: CheckCircle2 },
    ].map(({ label, value, icon: Icon }) => <Card key={label} className="border-[#dce1e3] shadow-none"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f7ecef] text-[#9b1b36]"><Icon className="h-5 w-5" /></span></CardContent></Card>)}</section>

    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {relevant.map((training) => {
        const present = attendanceForTraining(training.id).length;
        const registered = registrationsForTraining(training.id).length;
        return <article key={training.id} className="flex min-h-[310px] flex-col rounded-xl border border-[#dce1e3] bg-white p-6 shadow-[0_1px_2px_rgba(20,30,34,0.025)]"><div className="flex items-start justify-between gap-4"><Badge className={training.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-[#f7ecef] text-[#7b172e] hover:bg-[#f7ecef]"}>{training.status.replaceAll("_", " ")}</Badge><span className="text-xs font-semibold text-slate-400">{registered} joined · {present} present</span></div><h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">{training.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{training.description}</p><div className="mt-5 space-y-2.5 text-sm text-slate-600"><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#9b1b36]" />{new Date(training.scheduledAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#9b1b36]" />{training.location}</p><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#9b1b36]" />{training.durationHours} hours · {trainerName(training.trainerId, trainers)}</p></div><div className="mt-auto flex gap-2 pt-6">{canManage ? <Button className="flex-1 bg-[#641329] hover:bg-[#4e0f20]" onClick={() => setQrTraining(training)}><QrCode className="mr-2 h-4 w-4" />Open public QR</Button> : <Button asChild className="flex-1 bg-[#9b1b36] hover:bg-[#7b172e]"><Link href={getCheckInPath(training.id)}><ScanLine className="mr-2 h-4 w-4" />Join programme</Link></Button>}</div></article>;
      })}
    </section>
    {relevant.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center"><GraduationCap className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-medium text-slate-700">No programmes are assigned to your role.</p></div>}

    <CreateTrainingDialog open={createOpen} onOpenChange={setCreateOpen} trainers={trainers.filter((trainer) => trainer.status === "ACTIVE")} trainings={trainings} />
    <TrainingQrDialog training={qrTraining} open={Boolean(qrTraining)} onOpenChange={(open) => !open && setQrTraining(null)} />
  </div>;
}

function QrCanvas({ value }: { value: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) void QRCode.toCanvas(ref.current, value, { width: 280, margin: 2, color: { dark: "#171d25", light: "#ffffff" } }); }, [value]);
  return <canvas ref={ref} className="h-auto max-w-full rounded-lg" aria-label="Training attendance QR code" />;
}

function TrainingQrDialog({ training, open, onOpenChange }: { training: LocalTraining | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const url = training && typeof window !== "undefined" ? `${window.location.origin}${getCheckInPath(training.id)}` : "";
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Public programme QR</DialogTitle><DialogDescription>{training?.title}. Anyone with this link can enter their name, role and participant code to join, then mark attendance.</DialogDescription></DialogHeader>{training && url && <div className="flex flex-col items-center"><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><QrCanvas value={url} /></div><p className="mt-4 break-all rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500">{url}</p><Button className="mt-4 w-full" variant="outline" onClick={() => void navigator.clipboard.writeText(url)}>Copy public join link</Button></div>}</DialogContent></Dialog>;
}

function CreateTrainingDialog({ open, onOpenChange, trainers, trainings }: { open: boolean; onOpenChange: (open: boolean) => void; trainers: LocalTrainer[]; trainings: LocalTraining[] }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const audience = String(data.get("audience"));
    const audienceRoles = audience === "all" ? [Role.AGENT, Role.SALES_MANAGER, Role.HOA, Role.TRAINER] : audience === "leaders" ? [Role.SALES_MANAGER, Role.HOA] : [Role.AGENT];
    saveTrainings([...trainings, {
      id: `training-${Date.now()}`,
      title: String(data.get("title")),
      description: String(data.get("description")),
      trainerId: String(data.get("trainerId")),
      scheduledAt: new Date(String(data.get("scheduledAt"))).toISOString(),
      durationHours: Number(data.get("durationHours")),
      location: String(data.get("location")),
      audienceRoles,
      capacity: Number(data.get("capacity")),
      status: "SCHEDULED",
    }]);
    event.currentTarget.reset(); onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Schedule training</DialogTitle><DialogDescription>The programme becomes immediately available for QR attendance.</DialogDescription></DialogHeader><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><Field label="Programme title" name="title" /><Field label="Location" name="location" /><Field label="Date and time" name="scheduledAt" type="datetime-local" /><Field label="Duration (hours)" name="durationHours" type="number" defaultValue="2" /><Field label="Capacity" name="capacity" type="number" defaultValue="40" /><div className="space-y-2"><Label htmlFor="trainerId">Trainer</Label><select id="trainerId" name="trainerId" required className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.firstName} {trainer.lastName}</option>)}</select></div><div className="space-y-2"><Label htmlFor="audience">Intended participants</Label><select id="audience" name="audience" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"><option value="agents">Agents</option><option value="leaders">Sales managers & HOAs</option><option value="all">All workforce</option></select></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="description">Description</Label><textarea id="description" name="description" required className="min-h-24 w-full rounded-md border border-slate-300 bg-white p-3 text-sm" /></div><DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" className="bg-[#9b1b36] hover:bg-[#7b172e]">Schedule programme</Button></DialogFooter></form></DialogContent></Dialog>;
}

function Field({ label, name, type = "text", defaultValue }: { label: string; name: string; type?: string; defaultValue?: string }) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={type} defaultValue={defaultValue} required /></div>; }

export default function TrainingsPage() { return <ProtectedRoute requiredPermissions={[Permission.TRAININGS_READ]}><DashboardShell><TrainingsWorkspace /><NotificationPanel /></DashboardShell></ProtectedRoute>; }
