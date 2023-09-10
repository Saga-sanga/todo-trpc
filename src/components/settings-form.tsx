"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { buttonVariants } from "./ui/button";
import { inferAsyncReturnType } from "@trpc/server";
import { ServerClient } from "@/app/_trpc/serverClient";
import { Session } from "next-auth";
import { trpc } from "@/app/_trpc/client";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

type UserData = inferAsyncReturnType<ServerClient["user"]["getUser"]>;
type SettingsFormProps = {
  initialUser: UserData;
  session: Session | null;
};

export default function SettingsForm({
  initialUser,
  session,
}: SettingsFormProps) {
  const getUser = trpc.user.getUser.useQuery(
    {
      email: session?.user?.email as string,
    },
    { initialData: initialUser }
  );
  const [userImage, setUserImage] = useState<File>();
  const [userImageURL, setUserImageURL] = useState<string>();

  useEffect(() => {
    console.log(userImage);
    if (userImage) {
      const url = URL.createObjectURL(userImage);
      setUserImageURL(url);
    }
  }, [userImage]);

  return (
    <div>
      <article className="flex items-center justify-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage
            src={userImageURL ?? (getUser.data.image ?? undefined)}
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <label
          className={cn(
            buttonVariants({ variant: "outline" }),
            "cursor-pointer"
          )}
          htmlFor="image-input"
        >
          Change Avatar
        </label>
        <Input
          className="hidden"
          id="image-input"
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files
              ? setUserImage(e.target.files[0])
              : (e.target.value = "")
          }
        />
      </article>
    </div>
  );
}
