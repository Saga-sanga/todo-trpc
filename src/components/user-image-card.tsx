"use client";

import { User } from "next-auth";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { useState } from "react";

export default function UserImageCard({
  user,
}: {
  user: Pick<User, "email" | "image" | "name">;
}) {
  const [userImage, setUserImage] = useState(user.image ?? "");

  return (
    <article className="flex">
      <Avatar>
        <AvatarImage src={userImage} />
      </Avatar>
      <Input type="file" />
    </article>
  );
}
