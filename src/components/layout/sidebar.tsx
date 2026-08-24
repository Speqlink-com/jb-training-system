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
    <div className={cn("flex h-full w-64 flex-col border-r border-gray-200 bg-white shadow-sm", className)}>
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b border-gray-100 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-button-gradient flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">TMP</span>
          </div>
          <span className="font-semibold text-lg text-gray-900">Training Platform</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((group) => (
            <div key={group.title}>
              {/* Group Header */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide red-dot">
                    {group.title}
                  </p>
                  {group.items.some(item => item.children) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
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
                        "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover-red-accent group",
                        isActiveLink(item.href)
                          ? "bg-accent-gradient text-white shadow-md border-l-4 border-red-700"
                          : "text-gray-700 hover:text-gray-900"
                      )}
                    >
                      <item.icon className={cn(
                        "mr-3 h-4 w-4 transition-colors",
                        isActiveLink(item.href) 
                          ? "text-white" 
                          : "text-gray-500 group-hover:text-red-600"
                      )} />
                      {item.title}
                    </Link>

                    {/* Child Items */}
                    {item.children && isGroupExpanded(group.title) && (
                      <div className="ml-7 space-y-1 border-l-2 border-gray-100 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-red-50 hover:text-red-700 group",
                              isActiveLink(child.href)
                                ? "bg-red-100 text-red-700 font-medium"
                                : "text-gray-600"
                            )}
                          >
                            <child.icon className={cn(
                              "mr-3 h-3 w-3 transition-colors",
                              isActiveLink(child.href)
                                ? "text-red-700"
                                : "text-gray-400 group-hover:text-red-600"
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
      <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-red-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-button-gradient flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-medium">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-red-600 truncate font-medium">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}