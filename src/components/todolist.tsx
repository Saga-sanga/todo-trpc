"use client";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { Trash2 as Trash, Edit } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { serverClient } from "../app/_trpc/serverClient";
import DragDropList from "./dnd-list";
import TodoItem from "./todo-item";
import { Button } from "./ui/button";

export type TodoItems = Awaited<
  ReturnType<(typeof serverClient)["todos"]["getTodos"]>
>;

export type TodoItem = TodoItems[number];

type TodoListProps = {
  initalTodos: TodoItems;
  session: Session | null;
};

export default function TodoList({ initalTodos, session }: TodoListProps) {
  const utils = trpc.useContext();
  // TODO: Update state from todo dnd component
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
      const prevData = utils.todos.getTodos.getData(
        session?.user?.email ?? "guest"
      );
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

  const updateStatusTodo = async (item: TodoItem) => {
    setDone.mutate({ id: item.id, done: !item.done });
  };

  const handleRemoveTodo = async (item: TodoItem) => {
    removeTodo.mutate({ id: item.id });
  };

  return (
    <div className="mb-10">
      <h1 className="text-4xl text-center font-bold text-primary">Todo List</h1>
      <div className="text-black my-5 text-3xl w-[32rem]">
        <DragDropList
          initialItems={getTodos.data}
          handleRemoveTodo={handleRemoveTodo}
          updateStatusTodo={updateStatusTodo}
        />
        {/* {getTodos?.data?.map((todo) => (
          <div
            key={todo.id}
            className="flex border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md p-4 gap-3 items-center"
          >
            <input
              type="checkbox"
              id={`check-${todo.id}`}
              checked={!!todo.done}
              style={{ zoom: 1.4 }}
              onChange={async () =>
                setDone.mutate({ id: todo.id, done: !todo.done })
              }
            />
            <label
              className={cn(
                "dark:text-white text-sm leading-none",
                todo.done && "line-through"
              )}
              htmlFor={`check-${todo.id}`}
            >
              {todo.content}
            </label>
            <div className="ml-auto flex items-center">
              <Button className="border border-r-0 rounded-s-lg rounded-e-none" variant="ghost">
                <Edit className="w-4 h-4"/>
              </Button>
              <Button
                className="group border rounded-s-none rounded-e-lg"
                variant="ghost"
                onClick={async () => removeTodo.mutate({ id: todo.id })}
              >
                <Trash className="w-4 h-4 stroke-red-400 group-hover:stroke-red-600" />
              </Button>
            </div>
          </div>
        ))} */}
      </div>
      <div className="flex gap-3 items-center">
        {/* <label htmlFor="content">Todo</label> */}
        <input
          id="content"
          placeholder="Input todo"
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
