import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const todolists = pgTable("todolist", {
  id: serial("id").primaryKey(),
  title: text("title"),
  userId: text("user_id"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  // updateAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const todolistsRelations = relations(todolists, ({ many, one }) => ({
  todos: many(todos),
  author: one(users, {
    fields: [todolists.userId],
    references: [users.id],
  }),
}));

export const todos = pgTable("todo", {
  id: serial("id").primaryKey(),
  position: integer("position").default(0),
  content: text("content"),
  listId: text("list_id"),
  done: boolean("done"),
});

export const todosRelations = relations(todos, ({ one }) => ({
  todolists: one(todolists, {
    fields: [todos.listId],
    references: [todolists.id],
  }),
}));

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  todolists: many(todolists),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    refresh_token_expires_in: integer("refresh_token_expires_in"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);
