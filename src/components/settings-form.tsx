"use client";
import { trpc } from "@/app/_trpc/client";
import { ServerClient } from "@/app/_trpc/serverClient";
import { settingsFormSchema } from "@/db/validators";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { inferAsyncReturnType } from "@trpc/server";
import { Session } from "next-auth";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

export const dynamic = "force-dynamic";

type GetS3Response = {
  result: {
    data: string;
  };
};

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
  const { toast } = useToast();

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

  const isDisabled = isSubmitting || !isDirty;

  function handleImageInput(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      const limit = 5 * 1000000; // max limit 5mb

      if (e.target?.files[0].size > limit) {
        toast({
          variant: "destructive",
          title: "Image Size Exceeded",
          description: "Please upload a smaller file size.",
        });
        return;
      }
      const objurl = URL.createObjectURL(e.target.files[0]);
      setUserImage(e.target.files[0]);
      setUserImageURL(objurl);
      form.setValue("image", objurl, { shouldDirty: true });
    } else {
      e.target.value = "";
    }
  }

  async function uploadImageToS3(data: SettingsSchema) {
    if (userImage) {
      try {
        const res = await fetch(
          `/api/trpc/user.getPresignedUrl?input="${userImage.name}"`
        );
        const presignedUrlResponse = (await res.json()) as GetS3Response;
        const url = presignedUrlResponse.result.data;

        const S3Response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": userImage.type,
          },
          body: userImage,
        });

        if (S3Response.status === 200) {
          const uploadUrl = url.split("?")[0];
          data.image = uploadUrl;
          return data;
        }

        if (S3Response.status !== 200) {
          return;
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
    // Execute only if image has been changed
    if (initialUser.image !== data.image) {
      const result = await uploadImageToS3(data);

      if (result) {
        data = result;
      } else {
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: "Cannot update your data please try again.",
        });
        return;
      }
    }

    // Update User data in DB
    updateUser.mutate(data, {
      onSuccess: () =>
        toast({
          title: "Success!",
          description: "Profile updated successfully.",
        }),
    });
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
                {/* <span>
                  {getPresignedUrl.isFetching && (
                    <Icons.spinner className="w-3 h3 animate-spin" />
                  )}
                </span> */}
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
                <FormMessage />
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
