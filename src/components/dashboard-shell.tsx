import { cn } from "@/lib/utils";

export default function DashboardShell({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col mx-auto w-full max-w-full md:max-w-4xl gap-8", className)} {...props}>
      {children}
    </div>
  );
}
