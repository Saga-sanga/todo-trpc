import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { Trash2 as Trash } from "lucide-react";
import { Session } from "next-auth";
import { TodoItem } from "./todolist";

export default function TodoItem({
  todo,
  session,
}: {
  todo: TodoItem;
  session: Session | null;
}) {
  const utils = trpc.useContext();
  const setDone = trpc.todos.setDone.useMutation({
    onMutate: async (doneState) => {
      await utils.todos.getTodos.cancel();
      const prevState = utils.todos.getTodos.getData(
        session?.user?.email ?? "guest"
      );
      utils.todos.getTodos.setData(session?.user?.email ?? "guest", (old) => {
        if (old) {
          const index = old.findIndex((item) => item.id === doneState.id);
          old[index].done = doneState.done;
        }
        return old;
      });
      return { prevState };
    },
    onError: (err, prevData, context) =>
      utils.todos.getTodos.setData(
        session?.user?.email ?? "guest",
        context?.prevState
      ),
    onSettled: () => utils.todos.getTodos.invalidate(),
  });

  const removeTodo = trpc.todos.removeTodo.useMutation({
    onMutate: async ({ id }) => {
      await utils.todos.getTodos.cancel();
      const prevState = utils.todos.getTodos.getData(
        session?.user?.email ?? "guest"
      );
      utils.todos.getTodos.setData(session?.user?.email ?? "guest", (old) => {
        if (old) {
          const index = old.findIndex((ele) => ele.id === id);
          old.splice(index, 1);
        }
        console.log(old);
        return old;
      });
      return { prevState };
    },
    onError: (err, prevData, context) =>
      utils.todos.getTodos.setData(
        session?.user?.email ?? "guest",
        context?.prevState
      ),
    onSettled: () => utils.todos.getTodos.refetch(),
  });

  return (
    <div key={todo.id} className="flex gap-3 items-center">
      <input
        type="checkbox"
        id={`check-${todo.id}`}
        checked={!!todo.done}
        style={{ zoom: 1.6 }}
        onChange={async () => setDone.mutate({ id: todo.id, done: !todo.done })}
      />
      <label
        className={cn(
          "dark:text-white text-lg leading-none",
          todo.done && "line-through"
        )}
        htmlFor={`check-${todo.id}`}
      >
        {todo.content}
      </label>
      <button
        className="ml-auto"
        onClick={async () => removeTodo.mutate({ id: todo.id })}
      >
        <Trash className="stroke-red-400 hover:stroke-red-600" />
      </button>
    </div>
  );
}
