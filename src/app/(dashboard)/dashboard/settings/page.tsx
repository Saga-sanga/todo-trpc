import { trpc } from "@/app/_trpc/client";
import { createServerClient } from "@/app/_trpc/serverClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DashboardShell from "@/components/dashboard-shell";
import DashboardHeader from "@/components/header";
import SettingsForm from "@/components/settings-form";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const serverClient = await createServerClient(session);
  const initialUser = await serverClient.user.getUser({
    email: session?.user?.email as string,
  });

  if (!session?.user || !initialUser) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage user account settings" />
      <SettingsForm initialUser={initialUser} session={session} />
    </DashboardShell>
  );
}
