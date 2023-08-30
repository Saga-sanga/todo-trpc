"use client";

import { signIn } from "next-auth/react";

export default function GithubButton() {
  return <button onClick={() => signIn("github")}>Github</button>;
}
