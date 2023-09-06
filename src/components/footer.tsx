import { ListTodo } from "lucide-react";
import ModeToggle from "./mode-toggle";

export default function Footer() {
  return (
    <footer className="border-t w-full">
      <div className="container flex flex-col sm:flex-row gap-4 items-center justify-between py-10 md:h-24">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2">
          <ListTodo className="w-7 h-7" />
          <p className="text-sm text-center sm:text-left">
            Built by{" "}
            <a
              href="https://recksonk.in"
              target="_blank"
              className="underline underline-offset-4"
            >
              Reckson
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/Saga-sanga/todo-trpc"
              target="_blank"
              className="underline underline-offset-4"
            >
              Github
            </a>
            .
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
