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

export function modifyReferences(text: string, replacements: string[]): string {
  // La expresión regular busca texto dentro de paréntesis al final de los párrafos
  const regex = /\([^)]*\)\./g;

  // Recorre cada coincidencia encontrada y reemplaza con el elemento correspondiente del arreglo replacements
  let currentIndex = 0;
  return removeSpacesBeforeDots(
    text.replace(regex, (match) => {
      if (currentIndex < replacements.length) {
        // Reemplaza la referencia encontrada con el reemplazo correspondiente
        const replacement = replacements[currentIndex];
        currentIndex++;
        return replacement;
      } else {
        // Si no hay más reemplazos disponibles, devuelve la coincidencia original

        if (replacements.length === 0) {
          return ".";
        }
        return match;
      }
    })
  );
}

// this function will find in a text all final dots on all the sentences and if there are a space before the dot, it will remove it
export function removeSpacesBeforeDots(text: string): string {
  return text.replace(/ \./g, ".");
}
