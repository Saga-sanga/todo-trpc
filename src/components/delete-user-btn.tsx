"use client";
import { trpc } from "@/app/_trpc/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Icons } from "./icons";

export default function DeleteUserButton({ session }: { session: Session }) {
  const getUser = trpc.user.getUser.useQuery({
    email: session.user?.email as string,
  });
  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: () => {
      signOut();
    },
  });

  function handleDelete() {
    deleteUser.mutate({ id: getUser?.data?.id as string });
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <label className="text-sm font-medium">Danger zone</label>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={deleteUser.isLoading}>
            {deleteUser.isLoading ? (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
