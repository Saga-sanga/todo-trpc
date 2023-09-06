import * as schema from "@/db/schema";
import { router } from "@/server/trpc";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { todosRouter } from "./routers/todos";
import { userRouter } from "./routers/user";

export const db = drizzle(sql, { schema });

// Run migrate only when the development environment
process.env.NODE_ENV === "development" &&
  migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  user: userRouter,
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;
