"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, KeyRound, Loader2, Mail, MoreHorizontal, Plus, Search, ShieldCheck, UserCheck, Users, XCircle } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { createUser, listUsers, resendUserInvitation, setUserStatus, USER_ROLE_LABELS, type CreateUserResult, type PlatformUser, type UserRoleValue } from "@/lib/user-api";
import { ExcelExportButton } from "@/components/common/excel-export-button";
import type { ExcelExportColumn } from "@/lib/export/excel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const columns: ExcelExportColumn<PlatformUser>[] = [
  { header: "Role", value: (row) => USER_ROLE_LABELS[row.role], width: 20 },
  { header: "Employee / agent ID", value: (row) => row.agentCode || row.employeeId, width: 22 },
  { header: "First name", value: (row) => row.firstName, width: 18 },
  { header: "Last name", value: (row) => row.lastName, width: 18 },
  { header: "Email", value: (row) => row.email, width: 32 },
  { header: "Phone", value: (row) => row.phone, width: 20 },
  { header: "Branch", value: (row) => row.branchId, width: 18 },
  { header: "Department", value: (row) => row.department, width: 24 },
  { header: "Status", value: (row) => row.isActive ? "ACTIVE" : "INACTIVE", width: 14 },
  { header: "Account activated", value: (row) => row.passwordChanged ? "YES" : "PENDING", width: 20 },
  { header: "Last login", value: (row) => row.lastLoginAt ? new Date(row.lastLoginAt) : undefined, width: 21, numberFormat: "dd-mmm-yyyy hh:mm" },
];

interface UserDirectoryProps {
  role?: UserRoleValue;
  title: string;
  eyebrow: string;
  description: string;
}

export function UserDirectory({ role, title, eyebrow, description }: UserDirectoryProps) {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ message: string; warning?: boolean } | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listUsers({ role, activeOnly: false });
      setUsers(result.users);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Users could not be loaded");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => !query || [user.firstName, user.lastName, user.email, user.employeeId, user.agentCode, user.branchId, user.department, USER_ROLE_LABELS[user.role]].join(" ").toLowerCase().includes(query));
  }, [search, users]);

  const active = users.filter((user) => user.isActive).length;
  const pending = users.filter((user) => !user.passwordChanged).length;

  const updateStatus = async (user: PlatformUser) => {
    setWorkingId(user.id);
    setError("");
    setNotice(null);
    try {
      const updated = await setUserStatus(user.id, !user.isActive);
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "User status could not be changed");
    } finally {
      setWorkingId("");
    }
  };

  const resend = async (user: PlatformUser) => {
    setWorkingId(user.id);
    setError("");
    setNotice(null);
    try {
      await resendUserInvitation(user.id);
      setNotice({ message: `A new temporary password was emailed to ${user.email}.` });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The invitation could not be sent");
    } finally {
      setWorkingId("");
    }
  };

  return <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#9b1b36]">{eyebrow}</p><h1 className="mt-2 text-4xl font-bold tracking-[-0.045em] text-[#171d25]">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div><div className="flex flex-wrap gap-2"><ExcelExportButton columns={columns} rows={filtered} fileName={`jubilee-${role?.toLowerCase() || "users"}`} sheetName="Users" title={title} /><Button onClick={() => setDialogOpen(true)} className="bg-[#9b1b36] hover:bg-[#7b172e]"><Plus className="mr-2 h-4 w-4" />Add {role ? USER_ROLE_LABELS[role].toLowerCase() : "user"}</Button></div></header>

    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}
    {notice && <div className={`rounded-xl border px-5 py-4 text-sm ${notice.warning ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{notice.message}</div>}

    <section className="grid gap-4 sm:grid-cols-3">
      <SummaryCard label="Total accounts" value={users.length} icon={Users} note="Stored in PostgreSQL" />
      <SummaryCard label="Active access" value={active} icon={UserCheck} note="Allowed to sign in" />
      <SummaryCard label="Pending activation" value={pending} icon={KeyRound} note="Temporary password not replaced" />
    </section>

    <section className="overflow-hidden rounded-xl border border-[#dce1e3] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-900">User directory</h2><p className="mt-1 text-xs text-slate-500">New accounts receive a temporary password by email and must replace it at first login.</p></div><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search real accounts" className="bg-white pl-9" /></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#f8f9fa] text-[10px] uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role & identifier</th><th className="px-5 py-3">Assignment</th><th className="px-5 py-3">Account</th><th className="w-14 px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{loading ? <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-500"><span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading user directory</span></td></tr> : filtered.map((user) => <tr key={user.id} className="bg-white hover:bg-slate-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#641329] text-xs font-bold text-white">{user.firstName[0]}{user.lastName[0]}</span><div><p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Mail className="h-3 w-3" />{user.email}</p></div></div></td><td className="px-5 py-4"><p className="font-medium text-slate-700">{USER_ROLE_LABELS[user.role]}</p><p className="mt-1 font-mono text-xs text-slate-500">{user.agentCode || user.employeeId || "No identifier"}</p></td><td className="px-5 py-4"><p className="text-slate-700">{user.department || "No department"}</p><p className="mt-1 text-xs text-slate-400">{user.branchId || "No branch"}</p></td><td className="px-5 py-4"><Badge className={user.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>{user.isActive ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}{user.isActive ? "ACTIVE" : "INACTIVE"}</Badge><p className="mt-1 text-xs text-slate-400">{user.passwordChanged ? "Account activated" : "Invitation pending"}</p></td><td className="px-5 py-4"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={workingId === user.id}>{workingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="border-slate-200 bg-white shadow-xl"><DropdownMenuItem onClick={() => void updateStatus(user)}>{user.isActive ? "Deactivate access" : "Restore access"}</DropdownMenuItem>{!user.passwordChanged && <DropdownMenuItem onClick={() => void resend(user)}>Resend invitation</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></td></tr>)}{!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-500">No real accounts match this directory.</td></tr>}</tbody></table></div>
    </section>

    <CreateUserDialog open={dialogOpen} onOpenChange={setDialogOpen} fixedRole={role} onCreated={async (result) => { setDialogOpen(false); setNotice({ message: result.message, warning: !result.invitationSent }); await refresh(); }} />
  </div>;
}

function SummaryCard({ label, value, icon: Icon, note }: { label: string; value: number; icon: typeof Users; note: string }) {
  return <Card className="border-[#dce1e3] bg-white shadow-none"><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f7ecef] text-[#9b1b36]"><Icon className="h-5 w-5" /></span></CardContent></Card>;
}

function CreateUserDialog({ open, onOpenChange, fixedRole, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; fixedRole?: UserRoleValue; onCreated: (result: CreateUserResult) => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setError("");
    try {
      const result = await createUser({ role: fixedRole || String(data.get("role")) as UserRoleValue, firstName: String(data.get("firstName")), lastName: String(data.get("lastName")), email: String(data.get("email")), phone: String(data.get("phone") || ""), employeeId: String(data.get("employeeId") || ""), branchId: String(data.get("branchId") || ""), department: String(data.get("department") || "") });
      form.reset();
      await onCreated(result);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "The account could not be created");
    } finally {
      setSubmitting(false);
    }
  };
  const label = fixedRole ? USER_ROLE_LABELS[fixedRole] : "user";
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-white sm:max-w-2xl"><DialogHeader className="rounded-lg border border-slate-100 bg-slate-50 p-4"><DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#9b1b36]" />Add {label.toLowerCase()}</DialogTitle><DialogDescription>This creates a real account and emails a temporary password. The user must replace it at first login.</DialogDescription></DialogHeader><form onSubmit={submit} className="grid gap-4 rounded-xl bg-white sm:grid-cols-2">{error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p>}{!fixedRole && <div className="space-y-2 sm:col-span-2"><Label htmlFor="role">Role</Label><select id="role" name="role" required className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">{Object.entries(USER_ROLE_LABELS).map(([value, roleLabel]) => <option key={value} value={value}>{roleLabel}</option>)}</select></div>}<Field label="First name" name="firstName" /><Field label="Last name" name="lastName" /><Field label="Email" name="email" type="email" /><Field label="Phone" name="phone" type="tel" /><Field label="Employee / agent ID" name="employeeId" /><Field label="Branch code" name="branchId" required={false} /><div className="space-y-2 sm:col-span-2"><Label htmlFor="department">Department or specialization</Label><Input id="department" name="department" className="bg-white" placeholder="e.g. Compliance training" /></div><DialogFooter className="sm:col-span-2"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button><Button type="submit" disabled={submitting} className="bg-[#9b1b36] hover:bg-[#7b172e]">{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create and email credentials</Button></DialogFooter></form></DialogContent></Dialog>;
}

function Field({ label, name, type = "text", required = true }: { label: string; name: string; type?: string; required?: boolean }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={type} required={required} className="bg-white" /></div>;
}
