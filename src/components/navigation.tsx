"use client"
import { signOut } from "next-auth/react";
import GithubButton from "./githubButton";

export default function Navigation() {
  return (
    <>
      <GithubButton />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  );
}
