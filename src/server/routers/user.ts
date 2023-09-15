import { users } from "@/db/schema";
import { grenerateUploadURL } from "@/lib/s3";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "..";
import { protectedProcedure, router } from "../trpc";

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
        .select({
          name: users.name,
          email: users.email,
          image: users.image,
          id: users.id,
        })
        .from(users)
        .where(eq(users.email, input.email));
      return user;
    }),
  getPresignedUrl: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await grenerateUploadURL(input);
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().nullable(),
        email: z.string(),
        image: z.string().nullable(),
        id: z.string(),
      })
    )
    .mutation(async ({ input: { name, email, image, id } }) => {
      const [data] = await db
        .update(users)
        .set({ name, email, image })
        .where(eq(users.id, id))
        .returning();
      console.log(data);
      return data;
    }),
  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id } }) => {
      return await db.delete(users).where(eq(users.id, id)).returning();
    }),
});
