"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, ScanLine, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { getPublicTraining, joinTraining, markAttendance, PARTICIPANT_ROLE_LABELS, type AttendanceConfirmation, type ParticipantRole, type PublicTraining, type TrainingRegistration } from "@/lib/training-api";

const codeLabels: Record<ParticipantRole, string> = {
  AGENT: "Agent code",
  SALES_MANAGER: "Sales manager code",
  HOA: "HOA code",
  TRAINER: "Trainer code",
  ADMIN: "Administrator code",
  STAFF: "Staff / employee code",
  GUEST: "Guest identification code",
};

function CheckInContent() {
  const [training, setTraining] = useState<PublicTraining | null>(null);
  const [registration, setRegistration] = useState<TrainingRegistration | null>(null);
  const [record, setRecord] = useState<AttendanceConfirmation | null>(null);
  const [role, setRole] = useState<ParticipantRole>("AGENT");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const updateTime = () => setCurrentTime(Date.now());
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      const publicCode = new URLSearchParams(window.location.search).get("training");
      if (!publicCode) { setReady(true); return; }
      try {
        const programme = await getPublicTraining(publicCode);
        setTraining(programme);
        if (programme.audienceRoles.length > 0) setRole(programme.audienceRoles[0]);
      } catch (caught) {
        setError(caught instanceof ApiError ? caught.message : "This programme link could not be opened");
      } finally {
        setReady(true);
      }
    };
    void load();
  }, []);

  const handleJoin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!training) return;
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      const joined = await joinTraining(training.publicCode, {
        participantName: String(data.get("participantName") || ""),
        participantCode: String(data.get("participantCode") || ""),
        role,
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
      });
      setRegistration(joined);
      if (joined.attendanceMarked && joined.checkedInAt) {
        setRecord({ id: joined.id, registrationId: joined.id, participantName: joined.participantName, participantCode: joined.participantCode, role: joined.role, status: "PRESENT", checkedInAt: joined.checkedInAt });
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The programme could not be joined");
    } finally {
      setSubmitting(false);
    }
  };

  const markPresent = async () => {
    if (!registration || !training) return;
    setSubmitting(true);
    setError("");
    try {
      setRecord(await markAttendance(training.publicCode, registration.registrationToken));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Attendance could not be recorded");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) return <div className="grid min-h-dvh place-items-center bg-[#f8f9fa] text-sm text-slate-500"><span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Opening programme link</span></div>;
  if (!training) return <StateCard title="Programme link not found" message={error || "This QR code does not match an available training programme."} />;
  const attendanceStarted = currentTime >= new Date(training.scheduledAt).getTime();

  return <main className="min-h-dvh bg-[#f4f5f7] px-4 py-6 sm:px-6 sm:py-12">
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
      <header className="bg-[#641329] px-6 py-6 text-white sm:px-9 sm:py-8">
        <div className="flex items-center justify-between gap-5"><span className="grid h-12 w-24 place-items-center rounded-lg bg-white px-2"><Image src="/jubilee-logo.png" alt="Jubilee Insurance" width={96} height={96} className="h-auto w-full" priority /></span><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Public programme link</span></div>
        <h1 className="mt-7 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">{training.title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">{training.description}</p>
      </header>

      <div className="p-6 sm:p-9">
        <div className="grid gap-3 rounded-xl bg-[#f8f9fa] p-5 text-sm text-slate-600 sm:grid-cols-2"><p className="flex gap-3"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#9b1b36]" />{new Date(training.scheduledAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</p><p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9b1b36]" />{training.location}</p><p className="flex gap-3 sm:col-span-2"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#9b1b36]" />{training.durationHours} hours · Facilitated by {training.trainerName}</p></div>

        {error && registration && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {record ? <div className="mt-8 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></span><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-700">Attendance recorded</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Thank you, {record.participantName}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Your {codeLabels[record.role].toLowerCase()} <strong>{record.participantCode}</strong> was marked present at {new Date(record.checkedInAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}.</p><Button asChild variant="outline" className="mt-6 w-full"><Link href="/">Close attendance</Link></Button></div>
        : registration ? <div className="mt-8"><div className="rounded-xl border border-[#d9bdc4] bg-[#fbf4f6] p-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b1b36]">Programme joined</p><h2 className="mt-2 text-xl font-semibold text-slate-900">{registration.participantName}</h2><dl className="mt-4 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-xs text-slate-400">Role</dt><dd className="mt-1 font-medium text-slate-700">{PARTICIPANT_ROLE_LABELS[registration.role]}</dd></div><div><dt className="text-xs text-slate-400">Participant code</dt><dd className="mt-1 font-medium text-slate-700">{registration.participantCode}</dd></div></dl></div><p className="mt-5 text-center text-sm leading-6 text-slate-500">{attendanceStarted ? "The meeting has started. You can now confirm your attendance." : `Attendance opens at ${new Date(training.scheduledAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}.`}</p><Button onClick={() => void markPresent()} disabled={submitting || !training.attendanceOpen || !attendanceStarted} className="mt-4 h-12 w-full bg-[#9b1b36] text-base hover:bg-[#7b172e]">{submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ScanLine className="mr-2 h-5 w-5" />}{!training.attendanceOpen ? "Attendance is closed" : attendanceStarted ? "Mark attendance now" : "Available at meeting time"}</Button><button type="button" onClick={() => { setRegistration(null); setError(""); }} className="mt-4 w-full text-center text-xs font-semibold text-slate-500 hover:text-[#9b1b36]">Use a different participant code</button></div>
        : <form onSubmit={handleJoin} className="mt-8 space-y-5"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#9b1b36]"><UserPlus className="h-4 w-4" />Join this programme</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Participant details</h2><p className="mt-2 text-sm leading-6 text-slate-500">Enter your details exactly as they should appear on the trainer&apos;s attendance register.</p></div>{error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2 sm:col-span-2"><Label htmlFor="participantName">Full name</Label><Input id="participantName" name="participantName" autoComplete="name" placeholder="Enter your full name" required /></div><div className="space-y-2"><Label htmlFor="role">Role</Label><select id="role" name="role" value={role} onChange={(event) => setRole(event.target.value as ParticipantRole)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900">{training.audienceRoles.map((value) => <option key={value} value={value}>{PARTICIPANT_ROLE_LABELS[value]}</option>)}</select></div><div className="space-y-2"><Label htmlFor="participantCode">{codeLabels[role]}</Label><Input id="participantCode" name="participantCode" autoCapitalize="characters" placeholder={role === "AGENT" ? "e.g. AGT-001234" : "Enter your unique code"} required /></div><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.com" required /></div><div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+254 7…" required /></div></div><Button type="submit" disabled={submitting} className="h-12 w-full bg-[#9b1b36] text-base hover:bg-[#7b172e]">{submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}Join programme</Button><p className="text-center text-xs leading-5 text-slate-400">Returning participants can enter the same role and code to continue to attendance without creating a duplicate.</p></form>}
      </div>
    </div>
  </main>;
}

function StateCard({ title, message }: { title: string; message: string }) { return <main className="grid min-h-dvh place-items-center bg-[#f4f5f7] p-6"><div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg"><AlertCircle className="mx-auto h-10 w-10 text-[#9b1b36]" /><h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{message}</p><Button asChild variant="outline" className="mt-6"><Link href="/">Return home</Link></Button></div></main>; }

export default function AttendanceCheckInPage() { return <CheckInContent />; }
