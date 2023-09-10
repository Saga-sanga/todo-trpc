import Sidebar from "@/components/sidebar";
import { dashboardConfig } from "@/config/dashboard";
import { cn } from "@/lib/utils";

type DashboardProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardProps) {
  return (
    <div className={cn("container flex-1 gap-12 grid md:grid-cols-[200px_1fr]")}>
      <aside className="hidden w-[200px] flex-col md:flex">
        <Sidebar items={dashboardConfig.sidebarNav} />
      </aside>
      {children}
    </div>
  );
}
