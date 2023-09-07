import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import { Client } from "postmark";
import { users } from "@/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";

const postmark = new Client(process.env.POSTMARK_API_TOKEN as string);

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    EmailProvider({
      from: process.env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const [user] = await db
          .select()
          .from(users)
          .where(
            and(eq(users.email, identifier), isNotNull(users.emailVerified))
          );

        const templateId = user?.emailVerified
          ? process.env.POSTMARK_SIGN_IN_TEMPLATE
          : process.env.POSTMARK_ACTIVATION_TEMPLATE;

        if (!templateId) {
          throw new Error("Template ID is missing");
        }

        const result = await postmark.sendEmailWithTemplate({
          TemplateId: parseInt(templateId),
          To: identifier,
          From: provider.from,
          TemplateModel: {
            action_url: url,
            product_name: "TODO App",
          },
          Headers: [
            {
              // Set this to prevent Gmail from threading emails.
              // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
              Name: "X-Entity-Ref-ID",
              Value: new Date().getTime() + "",
            },
          ],
        });

        if (result.ErrorCode) {
          throw new Error(result.Message);
        }
      },
    }),
  ],
};
