"use client";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import TodoListItem from "./todo-item";
import { TodoItem, TodoItems } from "./todolist";

type DragDropListProp = {
  initialItems: TodoItems;
  handleRemoveTodo: (item: TodoItem) => Promise<void>;
  updateStatusTodo: (item: TodoItem) => Promise<void>;
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
  updateStatusTodo,
}: DragDropListProp) {
  const [items, setItems] = useState<TodoItems>([]);

  const utils = trpc.useContext();
  const reorderTodo = trpc.todos.reorderTodos.useMutation({
    onSettled: () => utils.todos.getTodos.refetch(),
  });

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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

    const newList = reorderedItems.map((item) => item.id);
    reorderTodo.mutate({ ids: newList });
  };

  return (
    <>
      {items.length !== 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                className="border divide-y rounded-md"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={`item-${item.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={cn(
                          "flex hover:bg-muted py-2 px-4 gap-3 items-center",
                          snapshot.isDragging && "bg-muted border"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoListItem
                          item={item}
                          handleRemoveTodo={handleRemoveTodo}
                          updateStatusTodo={updateStatusTodo}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}
