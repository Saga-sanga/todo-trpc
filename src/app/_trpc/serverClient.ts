import { appRouter } from "@/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { createContext } from "./context";

const session = await getServerSession(authOptions);

export const serverClient = appRouter.createCaller(await createContext(session));
