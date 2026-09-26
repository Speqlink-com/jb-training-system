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
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((current) =>
      current.includes(groupTitle)
        ? current.filter((title) => title !== groupTitle)
        : [...current, groupTitle],
    );
  };

  return (
    <div className={cn("flex h-full w-64 flex-col bg-[#641329] text-white", className)}>
      <div className="flex h-[4.5rem] items-center border-b border-white/10 px-5">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-16 shrink-0 place-items-center rounded-lg bg-white px-1.5 shadow-sm">
            <Image src="/jubilee-logo.png" alt="Jubilee Insurance" width={64} height={64} className="h-auto w-full" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">Jubilee Learning</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Operations hub</span>
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-5">
        <nav className="space-y-6" aria-label="Primary navigation">
          {navigation.map((group) => (
            <div key={group.title}>
              <div className="mb-1 flex items-center justify-between px-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/35">
                  {group.title}
                </p>
                {group.items.some((item) => item.children) && (
                  <button
                    type="button"
                    className="grid h-6 w-6 place-items-center rounded-md text-white/40 hover:bg-white/10 hover:text-white"
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
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActiveLink(item.href)
                          ? "bg-[#f7ecef] text-[#641329] shadow-sm"
                          : "text-white/68 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>

                    {item.children && expandedGroups.includes(group.title) && (
                      <div className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                              isActiveLink(child.href)
                                ? "bg-white/12 text-white"
                                : "text-white/55 hover:bg-white/8 hover:text-white",
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

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f7ecef] text-xs font-bold text-[#641329]">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.firstName} {user.lastName}</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {user.role.replaceAll("_", " ")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
