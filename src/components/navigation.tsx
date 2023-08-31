"use client";
import { signOut } from "next-auth/react";
import GithubButton from "./githubButton";
import { Session } from "next-auth";

export default function Navigation({ session }: { session: Session | null }) {
  return (
    <>
      {!session ? (
        <GithubButton />
      ) : (
        <button onClick={() => signOut()}>Sign out</button>
      )}
    </>
  );
}
