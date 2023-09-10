export const dashboardConfig = {
  sidebarNav: [
    {
      title: "Todo Lists",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};

export type DashboardConfig = typeof dashboardConfig;
export type SidebarItems = typeof dashboardConfig.sidebarNav;
