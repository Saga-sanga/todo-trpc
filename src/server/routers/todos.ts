import * as schema from "@/db/schema";
import { publicProcedure, router } from "../trpc";
import { asc, eq } from "drizzle-orm";
import { db } from "..";
import { z } from "zod";

export const todosRouter = router({
  getTodos: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await db.query.todos.findMany({
      where: eq(schema.todos.userId, input),
    });
  }),
  addTodo: publicProcedure
    .input(
      z.object({
        content: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input: { content, userId } }) => {
      await db.insert(schema.todos).values({ content, done: false, userId });
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
        .update(schema.todos)
        .set({ done: input.done })
        .where(eq(schema.todos.id, input.id));
      return true;
    }),
  removeTodo: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db
        .delete(schema.todos)
        .where(eq(schema.todos.id, input.id))
        .returning();
    }),
});
