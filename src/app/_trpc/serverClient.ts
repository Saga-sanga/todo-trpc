import { appRouter } from "@/server";
import { Session } from "next-auth";
import { createContext } from "./context";
import { inferAsyncReturnType } from "@trpc/server";

export const createServerClient = async (session: Session | null) =>
  appRouter.createCaller(await createContext(session));

// export type ServerClient = Awaited<ReturnType<typeof createServerClient>>;
export type ServerClient = inferAsyncReturnType<typeof createServerClient>;
