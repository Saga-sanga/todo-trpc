import DashboardShell from "@/components/dashboard-shell";
import DashboardHeader from "@/components/header";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Todo Lists" text="Create and manage your todo lists" />
    </DashboardShell>
  );
}
