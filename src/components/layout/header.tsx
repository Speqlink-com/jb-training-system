"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useUIStore } from "@/stores/ui.store";
import { useNotificationStore } from "@/stores/notification.store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { user, logout } = useAuth();
  const { toggleSidebar, toggleMobileSidebar } = useUIStore();
  const { unreadCount, toggleNotificationPanel } = useNotificationStore();

  if (!user) return null;

  const userInitials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <header className={cn("flex h-[4.5rem] shrink-0 items-center justify-between border-b border-[#dce1e3] bg-white px-4 sm:px-6", className)}>
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          onClick={toggleMobileSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:flex"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

      </div>

      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-[#f7ecef] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b172e] sm:block">
          {user.role.replaceAll("_", " ")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          onClick={toggleNotificationPanel}
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#9b1b36] px-1 text-[9px] font-bold text-white ring-2 ring-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 rounded-full p-0.5 hover:bg-slate-100" aria-label="Open account menu">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-[#641329] text-xs font-semibold text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 rounded-xl border-[#dce1e3] p-2 shadow-xl" align="end" forceMount>
            <DropdownMenuLabel className="px-3 py-2 font-normal">
              <p className="text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <button type="button" onClick={() => void logout()} className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-[#9b1b36] hover:bg-slate-100">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
