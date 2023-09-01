"use client";
import { cn } from "@/lib/utils";
import { ListTodo } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { UserNav } from "./user-nav";

export default function Navigation({ session }: { session: Session | null }) {
  return (
    <nav className="flex items-center justify-between w-full px-12 h-16">
      <div className=" text-md font-semibold">
        <Link className="flex items-center" href="/">
          <ListTodo className="w-8 h-8 mr-2" />
          TODO App
        </Link>
      </div>
      {!session ? (
        <Link
          className={cn(buttonVariants({ variant: "secondary" }))}
          href="/login"
        >
          Login
        </Link>
      ) : (
        <UserNav user={session.user} />
      )}
    </nav>
  );
}
