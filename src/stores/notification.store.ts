import { create } from 'zustand';
import { NotificationState } from '@/types';

interface NotificationStore extends NotificationState {
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  toggleNotificationPanel: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadCount: 3, // Set initial unread count for demo
  notificationPanelOpen: false,

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