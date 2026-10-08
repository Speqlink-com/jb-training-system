"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import { CalendarDays, CheckCircle2, Clock3, GraduationCap, Loader2, MapPin, Pencil, Plus, QrCode, ScanLine, Trash2, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Permission, Role } from "@/config/permissions";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiError } from "@/lib/api/client";
import { createTraining, deleteTraining, getCheckInPath, listTrainerOptions, listTrainings, PARTICIPANT_ROLE_LABELS, updateTraining, type ParticipantRole, type TrainerOption, type TrainingProgram } from "@/lib/training-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { copyText } from "@/lib/copy-text";

function TrainingsWorkspace() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [qrTraining, setQrTraining] = useState<TrainingProgram | null>(null);
  const [editTraining, setEditTraining] = useState<TrainingProgram | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrainingProgram | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canManage = user?.role === Role.ADMIN || user?.role === Role.TRAINER;
  const isAdmin = user?.role === Role.ADMIN;

  const removeTraining = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await deleteTraining(deleteTarget.id);
      setTrainings((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The programme could not be deleted");
    } finally {
      setDeleting(false);
    }
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [programmes, trainerOptions] = await Promise.all([
        listTrainings(),
        canManage ? listTrainerOptions() : Promise.resolve([]),
      ]);
      setTrainings(programmes);
      setTrainers(trainerOptions);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Training programmes could not be loaded");
    } finally {
      setLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  const attendeeTotal = trainings.reduce((sum, training) => sum + training.attendanceCount, 0);

  return <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">Learning operations</p><h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-[#171d25]">Training programmes</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Schedule learning and share a public QR link where any participant can join using their role and unique code, then mark attendance.</p></div><div className="flex flex-wrap gap-2">{canManage && <><Button asChild variant="outline"><Link href="/trainings/attendance"><Users className="mr-2 h-4 w-4" />Attendance console</Link></Button><Button onClick={() => setCreateOpen(true)} className="bg-[#9b1b36] hover:bg-[#7b172e]"><Plus className="mr-2 h-4 w-4" />New programme</Button></>}</div></header>

    {error && <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void refresh()}>Try again</Button></div>}

    <section className="grid gap-4 sm:grid-cols-3">{[
      { label: "Programmes", value: trainings.length, icon: GraduationCap },
      { label: "Open for check-in", value: trainings.filter((item) => item.attendanceOpen).length, icon: ScanLine },
      { label: "Recorded attendance", value: attendeeTotal, icon: CheckCircle2 },
    ].map(({ label, value, icon: Icon }) => <Card key={label} className="border-[#dce1e3] shadow-none"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f7ecef] text-[#9b1b36]"><Icon className="h-5 w-5" /></span></CardContent></Card>)}</section>

    {loading ? <div className="grid min-h-72 place-items-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500"><span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading training programmes</span></div> : <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {trainings.map((training) => <article key={training.id} className="flex min-h-[310px] flex-col rounded-xl border border-[#dce1e3] bg-white p-6 shadow-[0_1px_2px_rgba(20,30,34,0.025)]"><div className="flex items-start justify-between gap-4"><Badge className={training.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-[#f7ecef] text-[#7b172e] hover:bg-[#f7ecef]"}>{training.status.replaceAll("_", " ")}</Badge><span className="text-xs font-semibold text-slate-400">{training.registrationCount} joined · {training.attendanceCount} present</span></div><h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">{training.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{training.description}</p><div className="mt-5 space-y-2.5 text-sm text-slate-600"><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#9b1b36]" />{new Date(training.scheduledAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#9b1b36]" />{training.location}</p><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#9b1b36]" />{training.durationHours} hours · {training.trainerName}</p></div><div className="mt-auto flex gap-2 pt-6">{canManage ? <Button className="flex-1 bg-[#641329] hover:bg-[#4e0f20]" onClick={() => setQrTraining(training)}><QrCode className="mr-2 h-4 w-4" />Open public QR</Button> : <Button asChild className="flex-1 bg-[#9b1b36] hover:bg-[#7b172e]"><Link href={getCheckInPath(training.publicCode)}><ScanLine className="mr-2 h-4 w-4" />Join programme</Link></Button>}{isAdmin && <><Button type="button" variant="outline" size="icon" onClick={() => setEditTraining(training)} aria-label={`Edit ${training.title}`}><Pencil className="h-4 w-4" /></Button><Button type="button" variant="outline" size="icon" onClick={() => setDeleteTarget(training)} aria-label={`Delete ${training.title}`} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button></>}</div></article>)}
    </section>}
    {!loading && trainings.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center"><GraduationCap className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-medium text-slate-700">No programmes are assigned to your role.</p></div>}

    <CreateTrainingDialog open={createOpen} onOpenChange={setCreateOpen} trainers={trainers} isAdmin={user?.role === Role.ADMIN} onCreated={async () => { setCreateOpen(false); await refresh(); }} />
    <EditTrainingDialog key={editTraining?.id || "no-edit"} training={editTraining} trainers={trainers} onOpenChange={(open) => !open && setEditTraining(null)} onUpdated={async () => { setEditTraining(null); await refresh(); }} />
    <DeleteTrainingDialog training={deleteTarget} deleting={deleting} onOpenChange={(open) => !open && setDeleteTarget(null)} onConfirm={() => void removeTraining()} />
    <TrainingQrDialog training={qrTraining} open={Boolean(qrTraining)} onOpenChange={(open) => !open && setQrTraining(null)} />
  </div>;
}

function QrCanvas({ value }: { value: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) void QRCode.toCanvas(ref.current, value, { width: 280, margin: 2, color: { dark: "#171d25", light: "#ffffff" } }); }, [value]);
  return <canvas ref={ref} className="h-auto max-w-full rounded-lg" aria-label="Training attendance QR code" />;
}

function TrainingQrDialog({ training, open, onOpenChange }: { training: TrainingProgram | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const url = training && typeof window !== "undefined" ? `${window.location.origin}${getCheckInPath(training.publicCode)}` : "";
  const handleCopy = async () => {
    const copied = await copyText(url);
    setCopyState(copied ? "copied" : "failed");
    if (copied) window.setTimeout(() => setCopyState("idle"), 2000);
  };
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setCopyState("idle");
    onOpenChange(nextOpen);
  };
  return <Dialog open={open} onOpenChange={handleOpenChange}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Public programme QR</DialogTitle><DialogDescription>{training?.title}. Anyone with this link can enter their name, role and participant code to join, then mark attendance.</DialogDescription></DialogHeader>{training && url && <div className="flex flex-col items-center"><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><QrCanvas value={url} /></div><p className="mt-4 break-all rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500">{url}</p><Button className="mt-4 w-full" variant="outline" onClick={() => void handleCopy()}>{copyState === "copied" ? "Link copied" : copyState === "failed" ? "Copy failed — select the link above" : "Copy public join link"}</Button></div>}</DialogContent></Dialog>;
}

function dateTimeLocalValue(value: string) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function EditTrainingDialog({ training, trainers, onOpenChange, onUpdated }: { training: TrainingProgram | null; trainers: TrainerOption[]; onOpenChange: (open: boolean) => void; onUpdated: (training: TrainingProgram) => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [statusValue, setStatusValue] = useState(training?.status || "SCHEDULED");
  const [attendanceOpen, setAttendanceOpen] = useState(training?.attendanceOpen || false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!training) return;
    const data = new FormData(event.currentTarget);
    const audienceRoles = data.getAll("audienceRoles") as ParticipantRole[];
    if (audienceRoles.length === 0) {
      setError("Select at least one intended participant role");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const scheduledInput = String(data.get("scheduledAt"));
      const scheduledAt = scheduledInput === dateTimeLocalValue(training.scheduledAt)
        ? training.scheduledAt
        : new Date(scheduledInput).toISOString();
      const updated = await updateTraining(training.id, {
        title: String(data.get("title")),
        description: String(data.get("description")),
        trainerId: String(data.get("trainerId")),
        scheduledAt,
        durationHours: Number(data.get("durationHours")),
        location: String(data.get("location")),
        audienceRoles,
        capacity: Number(data.get("capacity")),
        status: String(data.get("status")) as TrainingProgram["status"],
        attendanceOpen: data.get("attendanceOpen") === "on",
        expectedUpdatedAt: training.updatedAt,
      });
      await onUpdated(updated);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The programme could not be updated");
    } finally {
      setSubmitting(false);
    }
  };
  const statusClosesAttendance = statusValue === "COMPLETED" || statusValue === "CANCELLED";
  return <Dialog open={Boolean(training)} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl"><DialogHeader><DialogTitle>Edit training programme</DialogTitle><DialogDescription>Administrators can update scheduling, trainer assignment, audience, capacity, and attendance status.</DialogDescription></DialogHeader>{training && <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p>}<Field label="Programme title" name="title" defaultValue={training.title} /><Field label="Date and time" name="scheduledAt" type="datetime-local" defaultValue={dateTimeLocalValue(training.scheduledAt)} /><div className="space-y-2"><Label htmlFor="trainerId">Trainer</Label><select id="trainerId" name="trainerId" defaultValue={training.trainerId} required className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">{!trainers.some((trainer) => trainer.id === training.trainerId) && <option value={training.trainerId}>{training.trainerName} (currently assigned)</option>}{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.firstName} {trainer.lastName}</option>)}</select></div><Field label="Location / meeting link" name="location" defaultValue={training.location} /><Field label="Duration in hours" name="durationHours" type="number" defaultValue={String(training.durationHours)} /><Field label="Capacity" name="capacity" type="number" defaultValue={String(training.capacity)} /><div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" name="status" value={statusValue} onChange={(event) => { const nextStatus = event.target.value as TrainingProgram["status"]; setStatusValue(nextStatus); if (nextStatus === "COMPLETED" || nextStatus === "CANCELLED") setAttendanceOpen(false); }} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"><option value="SCHEDULED">Scheduled</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></div><label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"><input type="checkbox" name="attendanceOpen" checked={attendanceOpen && !statusClosesAttendance} onChange={(event) => setAttendanceOpen(event.target.checked)} disabled={statusClosesAttendance} className="h-4 w-4 accent-[#9b1b36]" />Attendance open</label><fieldset className="sm:col-span-2"><legend className="text-sm font-medium text-slate-700">Intended participants</legend><div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(PARTICIPANT_ROLE_LABELS).map(([role, label]) => <label key={role} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"><input type="checkbox" name="audienceRoles" value={role} defaultChecked={training.audienceRoles.includes(role as ParticipantRole)} className="h-4 w-4 accent-[#9b1b36]" />{label}</label>)}</div></fieldset><div className="space-y-2 sm:col-span-2"><Label htmlFor="edit-description">Description</Label><textarea id="edit-description" name="description" defaultValue={training.description} required className="min-h-24 w-full rounded-md border border-slate-300 bg-white p-3 text-sm" /></div><DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button><Button type="submit" disabled={submitting} className="bg-[#9b1b36] hover:bg-[#7b172e]">{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save changes</Button></DialogFooter></form>}</DialogContent></Dialog>;
}

function DeleteTrainingDialog({ training, deleting, onOpenChange, onConfirm }: { training: TrainingProgram | null; deleting: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  return <Dialog open={Boolean(training)} onOpenChange={onOpenChange}><DialogContent className="bg-white sm:max-w-md"><DialogHeader><DialogTitle>Delete training programme?</DialogTitle><DialogDescription>This permanently removes <strong>{training?.title}</strong>, including {training?.registrationCount || 0} registrations and {training?.attendanceCount || 0} attendance records. This action cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>Cancel</Button><Button type="button" onClick={onConfirm} disabled={deleting} className="bg-red-600 text-white hover:bg-red-700">{deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Delete permanently</Button></DialogFooter></DialogContent></Dialog>;
}

function CreateTrainingDialog({ open, onOpenChange, trainers, isAdmin, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; trainers: TrainerOption[]; isAdmin: boolean; onCreated: () => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const audience = String(data.get("audience"));
    const audienceRoles: ParticipantRole[] = audience === "all" ? ["AGENT", "SALES_MANAGER", "HOA", "TRAINER", "ADMIN", "STAFF", "GUEST"] : audience === "leaders" ? ["SALES_MANAGER", "HOA"] : ["AGENT"];
    setSubmitting(true);
    setError("");
    try {
      await createTraining({ title: String(data.get("title")), description: String(data.get("description")), trainerId: isAdmin ? String(data.get("trainerId") || "") : undefined, scheduledAt: new Date(String(data.get("scheduledAt"))).toISOString(), durationHours: Number(data.get("durationHours")), location: String(data.get("location")), audienceRoles, capacity: Number(data.get("capacity")) });
      await onCreated();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The programme could not be created");
    } finally {
      setSubmitting(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>Schedule a training programme</DialogTitle><DialogDescription>The platform creates a public, shareable QR link after saving.</DialogDescription></DialogHeader><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">{error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p>}<Field label="Programme title" name="title" /><Field label="Date and time" name="scheduledAt" type="datetime-local" />{isAdmin ? <div className="space-y-2"><Label htmlFor="trainerId">Trainer</Label><select id="trainerId" name="trainerId" required className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"><option value="">Select trainer</option>{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.firstName} {trainer.lastName}</option>)}</select>{trainers.length === 0 && <p className="text-xs text-amber-700">Create an active trainer account before scheduling.</p>}</div> : <div className="space-y-2"><Label>Trainer</Label><div className="flex h-10 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">Assigned to you</div></div>}<Field label="Location / meeting link" name="location" /><Field label="Duration in hours" name="durationHours" type="number" defaultValue="2" /><Field label="Capacity" name="capacity" type="number" defaultValue="50" /><div className="space-y-2"><Label htmlFor="audience">Intended participants</Label><select id="audience" name="audience" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"><option value="agents">Agents</option><option value="leaders">Sales managers & HOAs</option><option value="all">All roles and invited guests</option></select></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="description">Description</Label><textarea id="description" name="description" required className="min-h-24 w-full rounded-md border border-slate-300 bg-white p-3 text-sm" /></div><DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button><Button type="submit" disabled={submitting || (isAdmin && trainers.length === 0)} className="bg-[#9b1b36] hover:bg-[#7b172e]">{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Schedule programme</Button></DialogFooter></form></DialogContent></Dialog>;
}

function Field({ label, name, type = "text", defaultValue }: { label: string; name: string; type?: string; defaultValue?: string }) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={type} defaultValue={defaultValue} min={type === "number" ? "1" : undefined} step={name === "durationHours" ? "0.5" : undefined} required /></div>; }

export default function TrainingsPage() { return <ProtectedRoute requiredPermissions={[Permission.TRAININGS_READ]}><DashboardShell><TrainingsWorkspace /><NotificationPanel /></DashboardShell></ProtectedRoute>; }
