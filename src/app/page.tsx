import Navigation from "@/components/navigation";
import UserData from "@/components/userData";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import TodoList from "@/components/todolist";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const initalTodos = await serverClient.todos.getTodos(
    session?.user?.email ?? "guest"
  );

  console.log({ initalTodos });

  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="w-full">
        <Navigation session={session} />
      </header>
      <main className="flex flex-col items-center">
        {session?.user ? (
          <UserData
            className="flex flex-col items-center"
            user={session.user}
          />
        ) : (
          <div className="text-2xl text-primary font-medium text-center my-8">
            Please Login to save your data
          </div>
        )}
        <TodoList initalTodos={initalTodos} session={session} />
      </main>
    </div>
  );
}
