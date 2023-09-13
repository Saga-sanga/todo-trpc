"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import { inferAsyncReturnType } from "@trpc/server";
import { ServerClient } from "@/app/_trpc/serverClient";
import { Session } from "next-auth";
import { trpc } from "@/app/_trpc/client";
import { Input } from "./ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Icons } from "./icons";
import { z } from "zod";
import { settingsFormSchema } from "@/db/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

type SettingsSchema = z.infer<typeof settingsFormSchema>;
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
  const updateUser = trpc.user.updateUser.useMutation();
  const [userImage, setUserImage] = useState<File>();
  const [userImageURL, setUserImageURL] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const getPresignedUrl = trpc.user.getPresignedUrl.useQuery(
    userImage?.name as string,
    {
      enabled: !!userImage,
      staleTime: 30 * 10000, // Stale in 30 seconds
      onSuccess: (data) => {
        const uploadUrl = data.split("?")[0];
        console.log("onSuccess", uploadUrl);
        form.setValue("image", uploadUrl, { shouldDirty: true });
      },
    }
  );

  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      email: getUser.data.email,
      image: getUser.data.image ?? "",
      name: getUser.data.name ?? "",
      id: getUser.data.id,
    },
  });

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  const isDisabled = isSubmitting || !isDirty || getPresignedUrl.isFetching;

  function handleImageInput(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    getPresignedUrl.refetch();
    if (e.target.files) {
      const limit = 5 * 1000000; // max limit 5mb

      if (e.target.files[0].size > limit) {
        toast({
          variant: "destructive",
          title: "Image Size Exceeded",
          description: "Please upload a smaller file size.",
        });
        return;
      }
      setUserImage(e.target.files[0]);
      setUserImageURL(URL.createObjectURL(e.target.files[0]));
    } else {
      e.target.value = "";
    }
  }

  async function uploadImageToS3() {
    if (getPresignedUrl.data && userImage) {
      const url = getPresignedUrl.data;

      console.log(url);

      try {
        const S3Response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": userImage.type,
          },
          body: userImage,
        });

        if (S3Response.status === 200) {
          return true;
        }

        if (S3Response.status !== 200) {
          return false;
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: "Cannot update your data please try again.",
        });
      }
    }
  }

  async function onSubmit(data: SettingsSchema) {
    let res: boolean | undefined = true;
    if (initialUser.image !== data.image) {
      res = await uploadImageToS3();
    }

    // Update User data in DB
    if (res) {
      updateUser.mutate(data, {
        onSuccess: () =>
          toast({
            title: "Success!",
            description: "Profile updated successfully.",
          }),
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value } }) => (
              <FormItem className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={userImageURL ?? value ?? undefined} />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <FormControl>
                  <label
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "cursor-pointer"
                    )}
                    htmlFor="image-input"
                  >
                    Change Avatar
                    <Input
                      className="hidden"
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageInput}
                    />
                  </label>
                </FormControl>
                <span>
                  {getPresignedUrl.isFetching && (
                    <Icons.spinner className="w-3 h3 animate-spin" />
                  )}
                </span>
              </FormItem>
            )}
          />
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isDisabled} className="self-start">
            {isSubmitting && (
              <Icons.spinner className="w-4 h4 mr-2 animate-spin" />
            )}
            Update
          </Button>
          <Input type="hidden" value={getUser.data.id} />
        </form>
      </Form>
    </div>
  );
}
