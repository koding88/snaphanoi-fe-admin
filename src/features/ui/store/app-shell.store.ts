import { create } from "zustand";

type AppShellStore = {
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
};

export const useAppShellStore = create<AppShellStore>((set) => ({
  isMobileSidebarOpen: false,
  isSidebarCollapsed: false,
  openMobileSidebar: () => set({ isMobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}));
