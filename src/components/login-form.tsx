"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Icons } from "./icons";
import { formSchema } from "@/db/validators";
import OAuthButtons from "./oauth-buttons";
import { useToast } from "./ui/use-toast";

type Schema = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: Schema) {
    console.log({ data });
    setIsLoading(true);
    toast({
      title: "Logging in",
      description: `${JSON.stringify(data)}`
    })
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
                <FormLabel className="font-normal peer-valid:-translate-y-4 peer-valid:scale-90 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:text-black transition text-muted-foreground duration-50 ease-out cursor-text bg-white px-1 absolute top-0 translate-x-3 translate-y-1">
                  Email
                </FormLabel>
                {/* <FormDescription>Enter your email to login</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login with Email
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
      <a
        className="text-center underline text-sm text-muted-foreground"
        href="/register"
      >
        Don't have an account? Sign Up
      </a>
    </div>
  );
}
