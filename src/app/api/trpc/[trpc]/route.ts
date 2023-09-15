import { createContext } from "@/app/_trpc/context";
import { appRouter } from "@/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export const revalidate = 0;
export const fetchCache = "only-no-store";
export const dynamic = "force-dynamic";

const handler = async (req: Request) => {
  const session = await getServerSession(authOptions);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => await createContext(session),
  });
};

export { handler as GET, handler as POST };
