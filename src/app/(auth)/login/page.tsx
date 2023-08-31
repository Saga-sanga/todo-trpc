import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, ListTodo } from "lucide-react";
import LoginForm from "@/components/login-form";

export default function Page() {
  return (
    <main className="relative space-y-6 min-h-screen grid place-content-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 left-4 md:top-8 md:left-8"
        )}
      >
        <ChevronLeft className="mr-2 w-4 h-4" />
        Back
      </Link>
      <div className="flex flex-col space-y-2 items-center text-center">
        <ListTodo className="w-12 h-12" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
