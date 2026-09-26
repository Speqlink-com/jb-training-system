import { create } from 'zustand';
import { NotificationState } from '@/types';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info" | "reminder";
  timestamp: string | Date;
  read?: boolean;
}

interface NotificationStore extends NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadCount: 3, // Set initial unread count for demo
  notificationPanelOpen: false,
  notifications: [],

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + (notification.read ? 0 : 1),
  })),

  setUnreadCount: (count) => set({ unreadCount: Math.max(0, count) }),
  
  incrementUnreadCount: () => set((state) => ({ 
    unreadCount: state.unreadCount + 1 
  })),
  
  decrementUnreadCount: () => set((state) => ({ 
    unreadCount: Math.max(0, state.unreadCount - 1) 
  })),
  
  setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
  
  toggleNotificationPanel: () => set((state) => ({ 
    notificationPanelOpen: !state.notificationPanelOpen 
  })),
}));
