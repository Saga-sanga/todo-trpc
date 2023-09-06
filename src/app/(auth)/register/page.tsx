import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import RegisterForm from "@/components/register-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListTodo } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }
  return (
    <main className="grid lg:grid-cols-2 min-h-screen">
      <div className="hidden col-span-1 flex-col bg-primary p-10 text-background lg:flex">
        <Link href="/" className=" text-lg font-medium flex items-center">
          <ListTodo className="w-10 h-10 mr-2 stroke-background" />
          TODO App
        </Link>
        <div className="mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This todo app has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Mike Hawk</footer>
          </blockquote>
        </div>
      </div>
      <div className="col-span-1 space-y-6 relative grid place-content-center">
        <Link
          className={cn(
            "absolute right-4 top-4 md:right-8 md:top-8",
            buttonVariants({ variant: "ghost" })
          )}
          href="/login"
        >
          Login
        </Link>
        <div className="text-center flex flex-col space-y-2">
          {/* <ListTodo className="w-8 h-8 mx-auto" /> */}
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
