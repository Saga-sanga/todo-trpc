"use client";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { UserNav } from "./user-nav";
import { ListTodo } from "lucide-react";

export default function Navigation({ session }: { session: Session | null }) {
  return (
    <nav className="flex items-center justify-between w-full px-12 h-16">
      <div className=" text-md font-semibold flex items-center">
        <ListTodo className="w-8 h-8 mr-2" />
        TODO App
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
