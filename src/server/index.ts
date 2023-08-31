import { publicProcedure, router } from "@/server/trpc";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { userRouter } from "./routers/user";
import { todosRouter } from "./routers/todos";
import { todos } from "@/db/schema";

export const db = drizzle(sql);

// const data = await db.select().from(todos);
// console.log(data);

// Run migrate only when the development environment
process.env.NODE_ENV === "development" &&
  migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  user: userRouter,
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;
