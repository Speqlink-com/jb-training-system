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
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col bg-[#641329] text-white shadow-2xl transition-transform duration-300 md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-[4.5rem] items-center justify-between border-b border-white/10 px-5">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="grid h-10 w-16 place-items-center rounded-lg bg-white px-1.5"><Image src="/jubilee-logo.png" alt="Jubilee Insurance" width={64} height={64} className="h-auto w-full" /></span>
          <span className="text-sm font-semibold">Jubilee Learning</span>
        </Link>
        <button type="button" onClick={closeMenu} className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white" aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className="flex-1 px-3 py-5">
        <nav className="space-y-6" aria-label="Mobile navigation">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/35">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActiveLink(item.href)
                        ? "bg-[#f7ecef] text-[#641329]"
                        : "text-white/68 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f7ecef] text-xs font-bold text-[#641329]">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">{user.role.replaceAll("_", " ")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );
}
