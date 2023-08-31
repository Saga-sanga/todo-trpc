import { User } from "next-auth";

interface UserProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "email" | "image" | "name">
}

export default function UserData({ user, ...props }: UserProps) {
  return (
    <div {...props}>
      <img className="rounded-full w-16 h-16" src={user.image || ""} alt="user" />
      <p>Welcome {user.name}</p>
      <span>{user.email}</span>
    </div>
  );
}
