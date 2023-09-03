import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const todos = pgTable("todo", {
  id: serial("id").primaryKey(),
  content: text("content"),
  userId: text("user_id"),
  done: boolean("done"),
});

export const todosRelations = relations(todos, ({ one }) => ({
  author: one(users, {
    fields: [todos.userId],
    references: [users.email],
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
  todos: many(todos),
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

// const res = {
//   "result": {
//       "data": [
//           {
//               "id": 20,
//               "content": "Enable editing",
//               "userId": "vulcan248@gmail.com",
//               "done": false
//           },
//           {
//               "id": 21,
//               "content": "Enable drag and drop with react-beautiful-dnd",
//               "userId": "vulcan248@gmail.com",
//               "done": false
//           },
//           {
//               "id": 22,
//               "content": "Add light and dark mode",
//               "userId": "vulcan248@gmail.com",
//               "done": false
//           },
//           {
//               "id": 23,
//               "content": "implement email signin",
//               "userId": "vulcan248@gmail.com",
//               "done": false
//           },
//           {
//               "id": 24,
//               "content": "update todolist UI",
//               "userId": "vulcan248@gmail.com",
//               "done": false
//           },
//           {
//               "id": 26,
//               "content": "Break down todolist to smaller components",
//               "userId": "vulcan248@gmail.com",
//               "done": false
//           },
//           {
//               "id": 27,
//               "content": "learn to use nodemailer for email notifications",
//               "userId": "vulcan248@gmail.com",
//               "done": false
//           },
//           {
//             "content": "react child element from an array has error removing itself"
//           }
//       ]
//   }
// }