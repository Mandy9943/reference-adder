import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const separateByParagraphs = (
  text: string,
  blankLines?: number
): string[] => {
  const regex = blankLines ? new RegExp(`\\n{${blankLines},}`) : /\n{1,}/;
  return text.split(regex);
};

export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
