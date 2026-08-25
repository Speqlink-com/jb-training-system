"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useUIStore } from "@/stores/ui.store";
import { getNavigationForRole } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileNavigationProps {
  isOpen: boolean;
}

export function MobileNavigation({ isOpen }: MobileNavigationProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const { setMobileSidebarOpen } = useUIStore();

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const closeMenu = () => setMobileSidebarOpen(false);

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col border-r border-slate-700 bg-[image:var(--sidebar-gradient)] text-slate-200 shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex h-[4.5rem] items-center justify-between border-b border-white/10 px-5">
        <Link href="/dashboard" className="flex items-center space-x-2" onClick={closeMenu}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-button-gradient">
            <span className="text-sm font-bold text-white">TMP</span>
          </div>
          <span className="text-sm font-semibold text-white">Jubilee Learning Hub</span>
        </Link>
        
        <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-white/10 hover:text-white" onClick={closeMenu}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-5">
          {navigation.map((group) => (
            <div key={group.title}>
              {/* Group Header */}
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-500">
                  {group.title}
                </p>
              </div>

              {/* Group Items */}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white",
                      isActiveLink(item.href)
                        ? "bg-white/12 text-white"
                        : "text-slate-300"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile Section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-button-gradient">
            <span className="text-sm font-medium text-white">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
