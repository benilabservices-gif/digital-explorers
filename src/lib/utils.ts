import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusion de classes conditionnelles avec résolution des conflits Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
