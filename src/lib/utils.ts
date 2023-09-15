import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbrevateString(str: string) {
  return str
    .split(" ")
    .map((subString) => subString.charAt(0))
    .join("")
    .toUpperCase();
}
