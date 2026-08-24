"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useUIStore } from "@/stores/ui.store";
import { useNotificationStore } from "@/stores/notification.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Bell, 
  Menu, 
  Settings, 
  User, 
  LogOut,
  HelpCircle
} from "lucide-react";

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
    <header className={`flex h-[4.5rem] items-center justify-between border-b border-slate-200/80 bg-white/90 shadow-[0_1px_0_rgb(15_23_42/.02)] backdrop-blur ${className}`}>
      <div className="flex items-center space-x-3 px-5 sm:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:flex"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative hidden w-64 lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search agents, trainings..."
            className="h-10 rounded-lg border-slate-200 bg-slate-50/70 pl-10 text-sm shadow-none focus:bg-white"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 px-4 sm:space-x-3 sm:px-6">
        {/* Quick Stats */}
        <div className="hidden lg:flex items-center space-x-4 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
            <p className="font-semibold text-slate-800">94.2%</p>
            <p className="text-[11px] text-slate-500">Compliance</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
            <p className="font-semibold text-slate-800">2,481</p>
            <p className="text-[11px] text-slate-500">Agents</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
            <p className="font-semibold text-slate-800">186</p>
            <p className="text-[11px] text-slate-500">Trainings</p>
          </div>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          onClick={toggleNotificationPanel}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-button-gradient border-2 border-white"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Help */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-button-gradient text-xs font-semibold text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <Badge variant="outline" className="w-fit mt-1">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
