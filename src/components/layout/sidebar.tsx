"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { getNavigationForRole } from "@/config/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);
  const isActiveLink = (href: string) =>
    href === "/dashboard" || href === "/trainings"
      ? pathname === href
      : pathname.startsWith(href);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((current) =>
      current.includes(groupTitle)
        ? current.filter((title) => title !== groupTitle)
        : [...current, groupTitle],
    );
  };

  return (
    <div
      className={cn(
        "flex h-full w-[17rem] flex-col border-r border-slate-200 bg-[#fcfbfb] text-slate-900 shadow-[8px_0_28px_rgba(15,23,42,0.035)]",
        className,
      )}
    >
      <div className="h-1 shrink-0 bg-[#a90024]" />
      <div className="flex h-[5.25rem] items-center border-b border-slate-200/80 px-5">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3.5">
          <span className="grid h-11 w-[4.75rem] shrink-0 place-items-center rounded-xl border border-slate-200 bg-white px-2 shadow-[0_3px_10px_rgba(15,23,42,0.05)]">
            <Image src="/jubilee-group-logo.png" alt="Jubilee Group" width={82} height={40} className="h-auto w-full" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-[-0.015em] text-slate-900">The Alpha Academy</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.17em] text-[#a90024]">Learning workspace</span>
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3.5 py-5">
        <nav className="space-y-5" aria-label="Primary navigation">
          {navigation.map((group) => (
            <div key={group.title}>
              <div className="mb-1.5 flex items-center justify-between px-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {group.title}
                </p>
                {group.items.some((item) => item.children) && (
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition hover:bg-[#fbeaec] hover:text-[#a90024]"
                    onClick={() => toggleGroup(group.title)}
                    aria-label={`Toggle ${group.title}`}
                  >
                    {expandedGroups.includes(group.title) ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActiveLink(item.href) ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl border px-2.5 py-2.5 text-sm font-semibold transition-all",
                        isActiveLink(item.href)
                          ? "border-[#ebc7cf] bg-[#fff5f7] text-[#85001c] shadow-[0_3px_12px_rgba(169,0,36,0.07)] before:absolute before:-left-[0.35rem] before:h-7 before:w-1 before:rounded-full before:bg-[#a90024]"
                          : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950 hover:shadow-sm",
                      )}
                    >
                      <span className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors",
                        isActiveLink(item.href)
                          ? "bg-[#a90024] text-white shadow-[0_4px_10px_rgba(169,0,36,0.2)]"
                          : "bg-slate-100 text-slate-500 group-hover:bg-[#fbeaec] group-hover:text-[#a90024]",
                      )}>
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{item.title}</span>
                    </Link>

                    {item.children && expandedGroups.includes(group.title) && (
                      <div className="ml-7 mt-1.5 space-y-1 border-l border-slate-200 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            aria-current={isActiveLink(child.href) ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                              isActiveLink(child.href)
                                ? "bg-[#fff5f7] text-[#85001c]"
                                : "text-slate-500 hover:bg-white hover:text-slate-900",
                            )}
                          >
                            <child.icon className="h-3.5 w-3.5" />
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-slate-200/80 bg-white/70 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#a90024] text-xs font-bold text-white shadow-[0_4px_10px_rgba(169,0,36,0.18)]">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
            <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {user.role.replaceAll("_", " ")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-[#ebc7cf] hover:bg-[#fff5f7] hover:text-[#a90024]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
