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

export const deleteReferences = (text: string): string => {
  const newText = modifyReferences(text, []);
  return newText;
};

export const replaceReferences = (
  text: string,
  replacements: string[]
): string => {
  const newText = modifyReferences(text, replacements);
  return newText;
};
export function findWordBoundaries(
  str: string,
  index: number
): {
  start: number;
  end: number;
} | null {
  // Primero, aseguramos que el índice esté dentro de los límites de la cadena
  if (index < 0 || index >= str.length) {
    return null; // Retorna nulo si el índice no es válido
  }

  // Encuentra el inicio de la palabra
  let start = index;
  while (start > 0 && str[start - 1] !== " ") {
    start--;
  }

  // Encuentra el final de la palabra
  let end = index;
  while (end < str.length && str[end] !== " ") {
    end++;
  }

  // Retorna el inicio y el final de la palabra
  return { start: start, end: end };
}

export const stringToEditorValue = (text: string) => {
  return text.split("\n").map((p) => ({
    type: "paragraph",
    children: [
      {
        text: p,
      },
    ],
  }));
};
