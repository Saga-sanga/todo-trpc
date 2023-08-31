import { users } from "@/db/schema";
import { db } from "..";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const userRouter = router({
  getUser: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));
      return user;
    }),
});
