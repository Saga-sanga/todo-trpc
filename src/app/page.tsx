import Navigation from "@/components/navigation";
import UserData from "@/components/userData";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log({ session });

  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="w-full">
        <Navigation session={session} />
      </header>
      <main>
        {session?.user ? (
          <UserData
            className="flex flex-col items-center"
            user={session.user}
          />
        ) : (
          <div className="text-2xl text-primary font-medium">
            Please Login to save your data
          </div>
        )}
      </main>
    </div>
  );
}
