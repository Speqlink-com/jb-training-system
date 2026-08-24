"use client";

import { useNotificationStore } from "@/stores/notification.store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  X, 
  Check, 
  CheckCheck, 
  Bell, 
  GraduationCap, 
  Users, 
  AlertTriangle,
  Info
} from "lucide-react";

// Mock notifications - replace with real data from API
const mockNotifications = [
  {
    id: "1",
    title: "Training Reminder",
    message: "AML Compliance Training starts in 30 minutes",
    type: "reminder",
    time: "2 minutes ago",
    read: false,
    icon: GraduationCap,
  },
  {
    id: "2", 
    title: "New Agent Onboarded",
    message: "John Kamau (AGT-001234) has completed onboarding",
    type: "success",
    time: "1 hour ago",
    read: false,
    icon: Users,
  },
  {
    id: "3",
    title: "Training Compliance Alert",
    message: "3 agents are overdue on mandatory training",
    type: "warning",
    time: "2 hours ago",
    read: true,
    icon: AlertTriangle,
  },
  {
    id: "4",
    title: "System Update",
    message: "Platform maintenance scheduled for tonight at 2 AM",
    type: "info",
    time: "1 day ago",
    read: true,
    icon: Info,
  },
];

export function NotificationPanel() {
  const { 
    notificationPanelOpen, 
    setNotificationPanelOpen, 
    unreadCount,
    setUnreadCount 
  } = useNotificationStore();

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  if (!notificationPanelOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/20"
        onClick={() => setNotificationPanelOpen(false)}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-80 bg-background border-l shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <h2 className="font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount}</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-full pb-20">
          <div className="p-4 space-y-4">
            {mockNotifications.length > 0 ? (
              mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex space-x-3 p-3 rounded-lg border transition-colors hover:bg-accent",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  <div className={cn("mt-1", getNotificationColor(notification.type))}>
                    <notification.icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium leading-tight">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-tight">
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}