import { User } from "next-auth";

interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "email" | "image" | "name">;
}

export default function UserData({ user, ...props }: UserProps) {
  return (
    <div {...props}>
      <p className="text-2xl text-primary font-medium text-center my-8">
        Welcome {user.name}
      </p>
    </div>
  );
}
