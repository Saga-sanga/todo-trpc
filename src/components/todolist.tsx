"use client";
import { useState } from "react";
import { Trash2 as Trash } from "lucide-react";
import { serverClient } from "../app/_trpc/serverClient";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import { Session } from "next-auth";
import {DragDropContext} from "react-beautiful-dnd"

type TodoListProps = {
  initalTodos: Awaited<ReturnType<(typeof serverClient)["todos"]["getTodos"]>>;
  session: Session | null;
};

export default function TodoList({ initalTodos, session }: TodoListProps) {
  const utils = trpc.useContext();
  const getTodos = trpc.todos.getTodos.useQuery(
    session?.user?.email ?? "guest",
    {
      initialData: initalTodos,
      staleTime: 3 * 1000,
    }
  );

  const addTodo = trpc.todos.addTodo.useMutation({
    onMutate: async (newTodo) => {
      await utils.todos.getTodos.cancel();
      const prevData = utils.todos.getTodos.getData();
      utils.todos.getTodos.setData(
        session?.user?.email ?? "guest",
        (old) =>
          old && [
            ...old,
            {
              id: old.length ? old[old?.length - 1].id + 1 : 1,
              done: false,
              content: newTodo.content,
              userId: newTodo.userId,
            },
          ]
      );
      return { prevData };
    },
    onError: (err, newTodo, context) => {
      utils.todos.getTodos.setData(
        session?.user?.email ?? "guest",
        context?.prevData
      );
    },
    onSettled: () => getTodos.refetch(),
  });

  const setDone = trpc.todos.setDone.useMutation({
    onMutate: async (doneState) => {
      await utils.todos.getTodos.cancel();
      const prevState = utils.todos.getTodos.getData();
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
      const prevState = utils.todos.getTodos.getData();
      utils.todos.getTodos.setData(session?.user?.email ?? "guest", (old) => {
        if (old) {
          const index = old.findIndex((ele) => ele.id === id);
          old.splice(index, 1);
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
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (content.length) {
      addTodo.mutate({ content, userId: session?.user?.email ?? "guest" });
      setContent("");
    }
  };

  return (
    <div>
      <h1 className="text-4xl text-center font-bold text-emerald-500">
        World's Best Todo List
      </h1>
      <DragDropContext onDragEnd={() => console.log("Drag End")}>
        <div className="text-black my-5 text-3xl">
          {getTodos?.data?.map((todo) => (
            <div key={todo.id} className="flex gap-3 items-center">
              <input
                type="checkbox"
                id={`check-${todo.id}`}
                checked={!!todo.done}
                style={{ zoom: 1.6 }}
                onChange={async () =>
                  setDone.mutate({ id: todo.id, done: !todo.done })
                }
              />
              <label
                className={cn("dark:text-white", todo.done && "line-through")}
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
          ))}
        </div>
      </DragDropContext>
      <div className="flex gap-3 items-center">
        <label htmlFor="content">Todo</label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSubmit() : null)}
          className="text-black flex-grow rounded-md border border-gray-300 py-2 px-4 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="text"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-800 text-white rounded-full font-bold py-2 px-4"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
