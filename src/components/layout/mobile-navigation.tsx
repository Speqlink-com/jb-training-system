"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useUIStore } from "@/stores/ui.store";
import { getNavigationForRole } from "@/config/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  isOpen: boolean;
}

export function MobileNavigation({ isOpen }: MobileNavigationProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { setMobileSidebarOpen } = useUIStore();

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);
  const closeMenu = () => setMobileSidebarOpen(false);
  const isActiveLink = (href: string) =>
    href === "/dashboard" || href === "/trainings"
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(19rem,88vw)] flex-col border-r border-slate-200 bg-[#fcfbfb] text-slate-900 shadow-2xl transition-transform duration-300 md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="h-1 shrink-0 bg-[#a90024]" />
      <div className="flex h-[5rem] items-center justify-between border-b border-slate-200 px-5">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="grid h-10 w-[4.5rem] place-items-center rounded-xl border border-slate-200 bg-white px-2 shadow-sm"><Image src="/jubilee-group-logo.png" alt="Jubilee Group" width={82} height={40} className="h-auto w-full" /></span>
          <span><span className="block text-sm font-bold">The Alpha Academy</span><span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-[#a90024]">Learning workspace</span></span>
        </Link>
        <button type="button" onClick={closeMenu} className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-[#fbeaec] hover:text-[#a90024]" aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className="flex-1 px-3.5 py-5">
        <nav className="space-y-5" aria-label="Mobile navigation">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActiveLink(item.href) ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl border px-2.5 py-2.5 text-sm font-semibold transition-all",
                      isActiveLink(item.href)
                        ? "border-[#ebc7cf] bg-[#fff5f7] text-[#85001c] before:absolute before:-left-[0.35rem] before:h-7 before:w-1 before:rounded-full before:bg-[#a90024]"
                        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950",
                    )}
                  >
                    <span className={cn("grid h-8 w-8 place-items-center rounded-lg", isActiveLink(item.href) ? "bg-[#a90024] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-[#fbeaec] group-hover:text-[#a90024]")}><item.icon className="h-4 w-4" /></span>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-slate-200 bg-white/70 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#a90024] text-xs font-bold text-white">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{user.role.replaceAll("_", " ")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#ebc7cf] hover:bg-[#fff5f7] hover:text-[#a90024]"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );
}
