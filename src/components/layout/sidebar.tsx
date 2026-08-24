"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getNavigationForRole } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isGroupExpanded = (groupTitle: string) => {
    return expandedGroups.includes(groupTitle);
  };

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={cn("flex h-full w-64 flex-col border-r border-slate-700 bg-[image:var(--sidebar-gradient)] text-slate-200", className)}>
      {/* Logo/Brand */}
      <div className="flex h-[4.5rem] items-center border-b border-white/10 px-5">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-button-gradient shadow-lg shadow-rose-950/30">
            <span className="text-white font-bold text-sm">TMP</span>
          </div>
          <div><span className="block text-sm font-semibold tracking-tight text-white">Jubilee</span><span className="block text-[10px] font-medium uppercase tracking-[.16em] text-slate-400">Learning hub</span></div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-5">
          {navigation.map((group) => (
            <div key={group.title}>
              {/* Group Header */}
              <div className="px-3 py-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-500">
                    {group.title}
                  </p>
                  {group.items.some(item => item.children) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-slate-500 hover:bg-white/10 hover:text-white"
                      onClick={() => toggleGroup(group.title)}
                    >
                      {isGroupExpanded(group.title) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Group Items */}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div key={item.href}>
                    {/* Main Item */}
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActiveLink(item.href)
                          ? "bg-white/12 text-white shadow-sm ring-1 ring-white/10"
                          : "text-slate-300 hover:bg-white/6 hover:text-white"
                      )}
                    >
                      <item.icon className={cn(
                        "mr-3 h-4 w-4 transition-colors",
                        isActiveLink(item.href) 
                          ? "text-white" 
                          : "text-slate-500 group-hover:text-rose-300"
                      )} />
                      {item.title}
                    </Link>

                    {/* Child Items */}
                    {item.children && isGroupExpanded(group.title) && (
                      <div className="ml-7 space-y-1 border-l border-white/10 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "group flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-white/6 hover:text-white",
                              isActiveLink(child.href)
                                ? "bg-white/10 text-white font-medium"
                                : "text-slate-400"
                            )}
                          >
                            <child.icon className={cn(
                              "mr-3 h-3 w-3 transition-colors",
                              isActiveLink(child.href)
                                ? "text-rose-300"
                                : "text-slate-600 group-hover:text-rose-300"
                            )} />
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

      {/* User Profile Section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-button-gradient shadow-md">
            <span className="text-white text-sm font-medium">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
