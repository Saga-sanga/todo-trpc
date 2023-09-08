import Navigation from "@/components/navigation";
import TodoList from "@/components/todolist";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { createServerClient } from "./_trpc/serverClient";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import { dashboardConfig } from "@/config/dashboard";

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
      <div className="container flex-1 grid md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <Sidebar items={dashboardConfig.sidebarNav}/>
        </aside>
        <main className="flex flex-col flex-1 items-center">
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
      </div>
      <Footer />
    </div>
  );
}
