import { initTRPC } from "@trpc/server";
import { Context } from "@/app/_trpc/context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
