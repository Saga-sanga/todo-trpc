import type { inferAsyncReturnType } from "@trpc/server";
import { Session } from "next-auth";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(session: Session | null) {
  return {
    user: session?.user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
