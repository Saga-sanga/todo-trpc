import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config(
  process.env.NODE_ENV === "production" ? {} : { path: ".env.local" }
);

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_PG_URL as string,
  },
} satisfies Config;
