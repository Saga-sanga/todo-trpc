"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { TodoItems } from "./todolist";

type Item = {
  id: string;
  content: string;
  done: boolean;
};

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(
    (k) =>
      ({
        id: `item-${k}`,
        content: `item ${k}`,
        done: false,
      } satisfies Item)
  );

// a little function to help us with reordering the result
const reorder = (list: TodoItems, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function DragDropList({
  initialItems,
}: {
  initialItems: TodoItems;
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
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={`item-${item.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className={cn(
                      "w-52 border border-gray-500 mb-2 bg-blue-300 p-2",
                      snapshot.isDragging && "bg-green-400"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.content}
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
