"use client";

import { useUIStore } from "@/stores/ui.store";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNavigation } from "./mobile-navigation";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const { sidebarOpen, mobileSidebarOpen } = useUIStore();

  return (
    <div className="flex h-dvh bg-[#f8f9fa]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col transition-all duration-300 ease-in-out md:flex",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <Sidebar />
      </aside>

      {/* Mobile Navigation */}
      <MobileNavigation isOpen={mobileSidebarOpen} />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Content Area */}
        <main className={cn("flex-1 overflow-y-auto bg-[#f8f9fa]", className)}>
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => useUIStore.getState().setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
