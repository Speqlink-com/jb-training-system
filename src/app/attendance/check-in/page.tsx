"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, MapPin, ScanLine, ShieldCheck } from "lucide-react";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  attendanceForTraining,
  canAttend,
  checkInToTraining,
  getTrainers,
  getTrainings,
  trainerName,
  type AttendanceRecord,
  type LocalTraining,
} from "@/lib/local-platform";

function CheckInContent() {
  const { user } = useAuth();
  const [training, setTraining] = useState<LocalTraining | null>(null);
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trainingId = new URLSearchParams(window.location.search).get("training");
      const selected = getTrainings().find((item) => item.id === trainingId) || null;
      setTraining(selected);
      if (selected && user) {
        setRecord(attendanceForTraining(selected.id).find((item) => item.userId === user.id) || null);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [user]);

  if (!ready) return <div className="grid min-h-dvh place-items-center bg-[#f8f9fa] text-sm text-slate-500">Opening attendance link…</div>;
  if (!training) return <StateCard icon={AlertCircle} title="Attendance link not found" message="This QR code does not match an available training programme." />;
  if (!user) return null;

  const eligible = canAttend(training, user);
  const confirm = () => setRecord(checkInToTraining(training, user));

  return <main className="min-h-dvh bg-[#f4f5f7] px-5 py-8 sm:py-14">
    <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
      <div className="bg-[#641329] px-7 py-7 text-white"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.19em] text-white/60"><ShieldCheck className="h-4 w-4" />Authenticated check-in</p><h1 className="mt-4 text-3xl font-bold tracking-[-0.035em]">{training.title}</h1></div>
      <div className="p-7 sm:p-9">
        <div className="space-y-3 rounded-xl bg-[#f8f9fa] p-5 text-sm text-slate-600"><p className="flex gap-3"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#9b1b36]" />{new Date(training.scheduledAt).toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" })}</p><p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9b1b36]" />{training.location}</p><p className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#9b1b36]" />{training.durationHours} hours · {trainerName(training.trainerId, getTrainers())}</p></div>

        {record ? <div className="mt-7 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-8 w-8" /></span><h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Attendance confirmed</h2><p className="mt-2 text-sm leading-6 text-slate-500">{record.attendeeName}, your check-in was recorded at {new Date(record.checkedInAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}.</p><Button asChild variant="outline" className="mt-6 w-full"><Link href="/dashboard">Return to dashboard</Link></Button></div> : eligible ? <div className="mt-7"><p className="text-center text-sm leading-6 text-slate-500">You are signing in as <strong className="text-slate-800">{user.firstName} {user.lastName}</strong>. Confirm once; duplicate attendance is automatically prevented.</p><Button onClick={confirm} className="mt-5 h-12 w-full bg-[#9b1b36] text-base hover:bg-[#7b172e]"><ScanLine className="mr-2 h-5 w-5" />Mark me present</Button></div> : <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800"><p className="font-semibold">This programme is not assigned to your role.</p><p className="mt-1">Ask the programme administrator to review the intended participant group.</p></div>}
      </div>
    </div>
  </main>;
}

function StateCard({ icon: Icon, title, message }: { icon: typeof AlertCircle; title: string; message: string }) { return <main className="grid min-h-dvh place-items-center bg-[#f4f5f7] p-6"><div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg"><Icon className="mx-auto h-10 w-10 text-[#9b1b36]" /><h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{message}</p><Button asChild variant="outline" className="mt-6"><Link href="/dashboard">Return to dashboard</Link></Button></div></main>; }

export default function AttendanceCheckInPage() { return <ProtectedRoute><CheckInContent /></ProtectedRoute>; }
