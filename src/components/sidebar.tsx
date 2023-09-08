"use client";
import { SidebarItems } from "@/config/dashboard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

export default function Sidebar({ items }: { items: SidebarItems }) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        return (
          item.href && (
            <Link key={index} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent"
                )}
              >
                {/* <Icon className="mr-2 h-4 w-4" /> */}
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
