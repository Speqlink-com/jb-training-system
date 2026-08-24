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
    <header className={`flex h-16 items-center justify-between border-b border-gray-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center space-x-4 px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search agents, trainings..."
            className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 px-6">
        {/* Quick Stats */}
        <div className="hidden lg:flex items-center space-x-4 text-sm">
          <div className="text-center bg-red-50 rounded-lg px-3 py-2 border border-red-100">
            <p className="font-semibold text-red-700">94.2%</p>
            <p className="text-xs text-red-600">Compliance</p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <p className="font-semibold text-gray-900">2,481</p>
            <p className="text-xs text-gray-600">Agents</p>
          </div>
          <div className="text-center bg-red-50 rounded-lg px-3 py-2 border border-red-100">
            <p className="font-semibold text-red-700">186</p>
            <p className="text-xs text-red-600">Trainings</p>
          </div>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 hover:text-red-600 hover:bg-red-50"
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
          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-red-50">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-button-gradient text-white">
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