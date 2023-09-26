import DashboardShell from "@/components/dashboard-shell";
import DashboardHeader from "@/components/header";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
]

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Todo Lists" text="Create and manage your todo lists" />
      <DataTable columns={columns} data={payments}/>
    </DashboardShell>
  );
}
