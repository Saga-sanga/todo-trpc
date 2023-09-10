type TodoListPageProps = {
  params: { todoListId: string };
};

export default function TodoListPage({ params }: TodoListPageProps) {
  return <div>{`Hello ${params.todoListId ?? "fellow"}`}</div>;
}
