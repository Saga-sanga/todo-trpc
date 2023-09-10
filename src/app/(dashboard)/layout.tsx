import Navigation from "@/components/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Footer from "@/components/footer";

type DashboardMainProps = {
  children: React.ReactNode;
};

export default async function DashboardMainLayout({
  children,
}: DashboardMainProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="w-full border-b">
        <Navigation session={session} />
      </header>
      <div className="grid flex-1">{children}</div>
      <Footer />
    </div>
  );
}
