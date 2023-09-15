"use client";
import { z } from "zod";
import { userAuthFormSchema } from "@/db/validators";
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
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import OAuthButtons from "./oauth-buttons";

export const revalidate = 0;
export const fetchCache = "'only-no-store'";

type Schema = z.infer<typeof userAuthFormSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(userAuthFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: Schema) {
    setIsLoading(true);
    alert(JSON.stringify(data));
  }

  return (
    <div className="space-y-6 flex flex-col w-80">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 flex flex-col"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input className="peer h-10" {...field} required />
                </FormControl>
                <FormLabel className="font-normal peer-valid:-translate-y-4 peer-valid:scale-90 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:text-primary transition text-muted-foreground duration-50 ease-out cursor-text bg-background px-1 absolute top-0 translate-x-3 translate-y-1">
                  Email
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute flex items-center inset-0">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="text-muted-foreground px-2 bg-background">
            Or continue with
          </span>
        </div>
      </div>
      <OAuthButtons isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}
