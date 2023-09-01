import { publicProcedure, router } from "@/server/trpc";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { userRouter } from "./routers/user";
import { todosRouter } from "./routers/todos";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const db = drizzle(sql, { schema });

// Run migrate only when the development environment
process.env.NODE_ENV === "development" &&
  migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  user: userRouter,
  todos: todosRouter,
  testRoute: publicProcedure.query(
    async () =>
      await db.query.users.findFirst({
        where: eq(schema.users.email, "vulcan248@gmail.com"),
        with: {
          todos: true,
        },
      })
  ),
});

export type AppRouter = typeof appRouter;
