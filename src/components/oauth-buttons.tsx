"use client";

import { Dispatch, SetStateAction } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

type OauthProps = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function OAuthButtons({ isLoading, setIsLoading }: OauthProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => {
          setIsLoading(true);
          signIn("github", { callbackUrl: "/" });
        }}
        disabled={isLoading}
        size="lg"
        variant="outline"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        Github
      </Button>
      <Button
        onClick={() => {
          setIsLoading(true);
          signIn("google", { callbackUrl: "/" });
        }}
        disabled={isLoading}
        size="lg"
        variant="outline"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}
