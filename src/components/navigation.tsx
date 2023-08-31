"use client";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { UserNav } from "./user-nav";

export default function Navigation({ session }: { session: Session | null }) {
  return (
    <nav>
      {!session ? (
        <Link className={cn(buttonVariants({variant: "outline"}))} href="/login">Login</Link>
      ) : (
        <UserNav user={session.user}/>
      )}
    </nav>
  );
}
