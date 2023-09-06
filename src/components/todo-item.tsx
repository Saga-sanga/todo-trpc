import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { Edit, Trash2 as Trash } from "lucide-react";
import { Session } from "next-auth";
import { TodoItem } from "./todolist";
import { Button } from "./ui/button";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

export default function TodoListItem({
  item,
  updateStatusTodo,
  handleRemoveTodo,
}: {
  item: TodoItem;
  handleRemoveTodo: (item: TodoItem) => Promise<void>;
  updateStatusTodo: (item: TodoItem) => Promise<void>;
}) {
  const utils = trpc.useContext();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(item.content ?? "");
  const editTodo = trpc.todos.editTodo.useMutation({
    onSettled: () => utils.todos.getTodos.refetch(),
  });

  const handleSubmit = () => {
    setEditing(false);
    console.log(content);
    editTodo.mutate({ id: item.id, content });
  };

  return (
    <>
      <Checkbox
        id={`check-${item.id}`}
        checked={!!item.done}
        onCheckedChange={() => updateStatusTodo(item)}
      />
      {editing ? (
        <input
          type="text"
          className="text-sm text-foreground w-full border px-2 py-1 rounded-md border-primary focus:outline-primary focus-visible:outline-primary focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      ) : (
        <label
          className={cn(
            "dark:text-white text-sm leading-none cursor-grab",
            item.done && "line-through"
          )}
          htmlFor={`check-${item.id}`}
        >
          {content}
        </label>
      )}
      <div className="ml-auto flex items-center">
        <Button
          className="h-7 px-2 border dark:text-accent-foreground hover:border-primary hover:z-10 -mr-[1px] rounded-s-lg rounded-e-none"
          variant="ghost"
          onClick={() => {
            setEditing((state) => !state);
            if (editing) handleSubmit();
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          className="h-7 px-2 group border hover:border-primary hover:z-10 rounded-s-none rounded-e-lg"
          variant="ghost"
          onClick={() => handleRemoveTodo(item)}
        >
          <Trash className="w-4 h-4 stroke-red-400 group-hover:stroke-red-600" />
        </Button>
      </div>
    </>
  );
}
