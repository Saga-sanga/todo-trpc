"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { TodoItems, TodoItem } from "./todolist";
import { Edit, Trash2 as Trash } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import { Session } from "next-auth";

type Item = {
  id: string;
  content: string;
  done: boolean;
};

// a little function to help us with reordering the result
const reorder = (list: TodoItems, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function DragDropList({
  initialItems,
  handleRemoveTodo,
  updateStatusTodo
}: {
  initialItems: TodoItems;
  handleRemoveTodo: (item: TodoItem) => Promise<void>
  updateStatusTodo: (item: TodoItem) => Promise<void>
}) {
  const [items, setItems] = useState<TodoItems>(initialItems);

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div className="border divide-y rounded-lg" ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={`item-${item.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className={cn(
                      "flex  py-2 px-4 gap-3 items-center",
                      snapshot.isDragging && "bg-background border"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <input
                      type="checkbox"
                      id={`check-${item.id}`}
                      checked={!!item.done}
                      style={{ zoom: 1.4 }}
                      onChange={() =>
                        updateStatusTodo(item)
                      }
                    />
                    <label
                      className={cn(
                        "dark:text-white text-sm leading-none cursor-grab",
                        item.done && "line-through"
                      )}
                      htmlFor={`check-${item.id}`}
                    >
                      {item.content}
                    </label>
                    <div className="ml-auto flex items-center">
                      <Button
                        className="h-7 border border-r-0 rounded-s-lg rounded-e-none"
                        variant="ghost"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="h-7 group border rounded-s-none rounded-e-lg"
                        variant="ghost"
                        onClick={() => handleRemoveTodo(item)}
                      >
                        <Trash className="w-4 h-4 stroke-red-400 group-hover:stroke-red-600" />
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
