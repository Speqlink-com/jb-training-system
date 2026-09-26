"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Award, CheckCircle2, GraduationCap, Mail, MoreHorizontal, Plus, Search, ShieldCheck, Users, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { ExcelExportButton } from "@/components/common/excel-export-button";
import { ProtectedRoute } from "@/lib/auth/protected-route";
import { Role } from "@/config/permissions";
import type { ExcelExportColumn } from "@/lib/export/excel";
import {
  getTrainers,
  getTrainings,
  PLATFORM_CHANGE_EVENT,
  saveTrainers,
  type LocalTrainer,
} from "@/lib/local-platform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const columns: ExcelExportColumn<LocalTrainer>[] = [
  { header: "Employee ID", value: (row) => row.employeeId, width: 16 },
  { header: "First name", value: (row) => row.firstName, width: 18 },
  { header: "Last name", value: (row) => row.lastName, width: 18 },
  { header: "Email", value: (row) => row.email, width: 30 },
  { header: "Phone", value: (row) => row.phone, width: 20 },
  { header: "Specializations", value: (row) => row.specializations.join(", "), width: 36 },
  { header: "Status", value: (row) => row.status, width: 14 },
  { header: "Joined", value: (row) => new Date(row.joinedAt), width: 16, numberFormat: "dd-mmm-yyyy" },
];

function TrainerWorkspace() {
  const [trainers, setTrainers] = useState<LocalTrainer[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const refresh = () => setTrainers(getTrainers());
  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(PLATFORM_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(PLATFORM_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return trainers.filter((trainer) => !query || [trainer.firstName, trainer.lastName, trainer.email, trainer.employeeId, ...trainer.specializations].join(" ").toLowerCase().includes(query));
  }, [search, trainers]);

  const trainingCounts = useMemo(() => {
    return getTrainings().reduce<Record<string, number>>((counts, training) => {
      counts[training.trainerId] = (counts[training.trainerId] || 0) + 1;
      return counts;
    }, {});
  }, []);

  const toggleStatus = (trainer: LocalTrainer) => {
    saveTrainers(trainers.map((item) => item.id === trainer.id ? {
      ...item,
      status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    } : item));
  };

  const removeTrainer = (trainer: LocalTrainer) => {
    if ((trainingCounts[trainer.id] || 0) > 0) {
      window.alert("This trainer still owns training programmes. Reassign those programmes before removal.");
      return;
    }
    if (window.confirm(`Remove ${trainer.firstName} ${trainer.lastName} from the trainer directory?`)) {
      saveTrainers(trainers.filter((item) => item.id !== trainer.id));
    }
  };

  const active = trainers.filter((trainer) => trainer.status === "ACTIVE").length;
  const specializations = new Set(trainers.flatMap((trainer) => trainer.specializations)).size;

  return (
    <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">Administration · People</p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-[#171d25]">Trainer control centre</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Control trainer access, ownership and programme readiness from one operational view.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExcelExportButton columns={columns} rows={trainers} fileName="jubilee-trainers" sheetName="Trainers" title="Jubilee trainer directory" />
          <Button onClick={() => setDialogOpen(true)} className="bg-[#9b1b36] hover:bg-[#7b172e]"><Plus className="mr-2 h-4 w-4" />Add trainer</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total trainers", value: trainers.length, icon: Users, note: "Registered facilitators" },
          { label: "Active access", value: active, icon: CheckCircle2, note: "Able to enter the workspace" },
          { label: "Capabilities", value: specializations, icon: Award, note: "Specialist areas covered" },
        ].map(({ label, value, icon: Icon, note }) => (
          <Card key={label} className="border-[#dce1e3] shadow-none"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f7ecef] text-[#9b1b36]"><Icon className="h-5 w-5" /></span></CardContent></Card>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-[#dce1e3] bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-semibold text-slate-900">Trainer directory</h2><p className="mt-1 text-xs text-slate-500">Inactive trainers are blocked at their next login.</p></div>
          <div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search trainers" className="pl-9" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-[#f8f9fa] text-[10px] uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-5 py-3 font-semibold">Trainer</th><th className="px-5 py-3 font-semibold">Capabilities</th><th className="px-5 py-3 font-semibold">Programmes</th><th className="px-5 py-3 font-semibold">Access</th><th className="w-14 px-5 py-3" /></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#641329] text-xs font-bold text-white">{trainer.firstName[0]}{trainer.lastName[0]}</span><div><p className="font-semibold text-slate-900">{trainer.firstName} {trainer.lastName}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Mail className="h-3 w-3" />{trainer.email}</p></div></div></td>
                  <td className="px-5 py-4"><div className="flex max-w-sm flex-wrap gap-1.5">{trainer.specializations.map((item) => <Badge key={item} variant="outline" className="font-medium">{item}</Badge>)}</div></td>
                  <td className="px-5 py-4"><p className="font-semibold text-slate-800">{trainingCounts[trainer.id] || 0}</p><p className="text-xs text-slate-400">assigned</p></td>
                  <td className="px-5 py-4"><Badge className={trainer.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>{trainer.status === "ACTIVE" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}{trainer.status}</Badge></td>
                  <td className="px-5 py-4"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => toggleStatus(trainer)}>{trainer.status === "ACTIVE" ? "Deactivate access" : "Restore access"}</DropdownMenuItem><DropdownMenuItem className="text-red-600" onClick={() => removeTrainer(trainer)}>Remove trainer</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AddTrainerDialog open={dialogOpen} onOpenChange={setDialogOpen} trainers={trainers} />
    </div>
  );
}

function AddTrainerDialog({ open, onOpenChange, trainers }: { open: boolean; onOpenChange: (open: boolean) => void; trainers: LocalTrainer[] }) {
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim().toLowerCase();
    if (trainers.some((trainer) => trainer.email === email)) { setError("A trainer with this email already exists."); return; }
    const specializations = String(data.get("specializations") || "").split(",").map((item) => item.trim()).filter(Boolean);
    const trainer: LocalTrainer = {
      id: `trainer-${Date.now()}`,
      firstName: String(data.get("firstName") || "").trim(),
      lastName: String(data.get("lastName") || "").trim(),
      email,
      phone: String(data.get("phone") || "").trim(),
      employeeId: String(data.get("employeeId") || "").trim(),
      specializations,
      status: "ACTIVE",
      joinedAt: new Date().toISOString(),
    };
    saveTrainers([...trainers, trainer]);
    setError("");
    onOpenChange(false);
    event.currentTarget.reset();
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#9b1b36]" />Add a trainer</DialogTitle><DialogDescription>Create a local trainer profile. Authentication remains limited to the listed hardcoded demo accounts.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4">{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="grid gap-4 sm:grid-cols-2"><Field label="First name" name="firstName" /><Field label="Last name" name="lastName" /><Field label="Email" name="email" type="email" /><Field label="Phone" name="phone" /><Field label="Employee ID" name="employeeId" /><Field label="Specializations" name="specializations" placeholder="Compliance, Product knowledge" /></div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" className="bg-[#9b1b36] hover:bg-[#7b172e]"><GraduationCap className="mr-2 h-4 w-4" />Add trainer</Button></DialogFooter></form></DialogContent></Dialog>;
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={type} placeholder={placeholder} required /></div>;
}

export default function TrainersPage() {
  return <ProtectedRoute requiredRoles={[Role.ADMIN]}><DashboardShell><TrainerWorkspace /><NotificationPanel /></DashboardShell></ProtectedRoute>;
}
