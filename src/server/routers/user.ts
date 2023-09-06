import { users } from "@/db/schema";
import { db } from "..";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  getUser: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      // User should only be able to access their own data
      if (ctx.user?.email !== input.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));
      return user;
    }),
});
