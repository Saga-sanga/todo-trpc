import Navigation from "@/components/navigation";
import TodoList from "@/components/todolist";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { createServerClient } from "./_trpc/serverClient";
import Footer from "@/components/footer";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const serverClient = await createServerClient(session);
  const initalTodos = await serverClient.todos.getTodos(
    session?.user?.email ?? "guest"
  );

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="w-full border-b">
        <Navigation session={session} />
      </header>
      <main className="flex flex-col flex-1 items-center container">
        {!session?.user && (
          <div className="text-center my-8">
            <h1 className="text-3xl font-medium">
              Please Login to save private data.
            </h1>
            <p className="text-xl">
              You are currently on a shared guest account.
            </p>
          </div>
        )}
        <TodoList initalTodos={initalTodos} session={session} />
      </main>
      <Footer />
    </div>
  );
}
