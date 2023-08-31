import Navigation from "@/components/navigation";
import UserData from "@/components/userData";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log({ session });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navigation session={session} />
      {session?.user ? (
        <UserData className="flex flex-col items-center" user={session.user} />
      ) : (
        <div>Hello friend, please Sign In</div>
      )}
    </main>
  );
}
