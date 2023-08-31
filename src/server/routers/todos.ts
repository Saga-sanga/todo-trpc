import { todos } from "@/db/schema";
import { publicProcedure, router } from "../trpc";
import { asc, eq } from "drizzle-orm";
import { db } from "..";
import { z } from "zod";

export const todosRouter = router({
  getTodos: publicProcedure.query(async () => {
    return await db.select().from(todos).orderBy(asc(todos.id));
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    await db.insert(todos).values({ content: input, done: false });
    return true;
  }),
  setDone: publicProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(todos)
        .set({ done: input.done })
        .where(eq(todos.id, input.id));
      return true;
    }),
  removeTodo: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(todos).where(eq(todos.id, input.id)).returning();
    }),
});
