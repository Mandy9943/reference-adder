/* eslint-disable @typescript-eslint/no-explicit-any */
import { findWordBoundaries } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { BaseEditor, Editor, Text, Transforms } from "slate";
import { useSlateStatic } from "slate-react";

const Leaf = ({
  attributes,
  children,
  leaf,
}: PropsWithChildren<{
  attributes: any;
  leaf: any;
}>) => {
  console.log(leaf);
  const editor = useSlateStatic();

  if (leaf.highlightGreen) {
    return (
      <span
        {...attributes}
        onClick={(event) => {
          event.preventDefault(); // Prevents the editor from losing focus
          deleteHighlight(editor);
        }}
        className="bg-green-200"
      >
        {children}
      </span>
    );
  }

  if (leaf.highlightYellow) {
    return (
      <span {...attributes} className="bg-yellow-200">
        {children}
      </span>
    );
  }

  return (
    <span
      {...attributes}
      onClick={(event) => {
        event.preventDefault(); // Prevents the editor from losing focus
        insertTextAfter(editor, leaf, " Mullins (2020)");
      }}
    >
      {children}
    </span>
  );
};

export default Leaf;

function insertTextAfter(editor: BaseEditor, text: string) {
  if (editor.selection) {
    const { focus } = editor.selection;
    const point = { ...focus, offset: focus.offset }; // We copy the focus point
    const at = { ...point };
    const textEditor = editor.first(at);

    console.log(textEditor);
    const text2 = textEditor[0].text;

    // word on text2  that match the offset of point.offset
    const positions = findWordBoundaries(text2, point.offset);
    console.log({
      positions,
    });

    console.log(at);

    console.log(editor);
    Transforms.insertText(editor, text, {
      at: {
        path: at.path,
        offset: positions.end,
      },
    });
    console.log(editor);
  }
}

function deleteHighlight(editor) {
  console.log("click");

  if (!editor.selection) return; // Asegúrate de que hay una selección activa

  const { focus } = editor.selection; // Obtiene el punto de foco de la selección actual
  const [node] = Editor.node(editor, focus.path); // Obtiene el nodo en el punto de foco

  if (!Text.isText(node)) return; // Asegúrate de que el nodo es un nodo de texto

  const text = node.text; // Extrae el texto del nodo
  const regex = /\w+\s\(\d{4}\)/g; // Define la expresión regular para buscar coincidencias

  let closestMatch = null;
  let closestDistance = Infinity;

  // Busca todas las coincidencias de la expresión regular en el texto
  const matches = [...text.matchAll(regex)];
  matches.forEach((match) => {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;
    const matchRange = { start: matchStart, end: matchEnd };
    // Calcula la distancia desde el punto de foco hasta el inicio y fin de la coincidencia
    const distanceToMatchStart = Math.abs(focus.offset - matchStart);
    const distanceToMatchEnd = Math.abs(focus.offset - matchEnd);

    // Determina si esta coincidencia es la más cercana al punto de foco
    if (
      distanceToMatchStart < closestDistance ||
      distanceToMatchEnd < closestDistance
    ) {
      closestDistance = Math.min(distanceToMatchStart, distanceToMatchEnd);
      closestMatch = matchRange;
    }
  });

  console.log(closestMatch);

  // Si se encontró una coincidencia cercana, elimínala
  if (closestMatch) {
    const rangeToDelete = {
      anchor: { path: focus.path, offset: closestMatch.start },
      focus: { path: focus.path, offset: closestMatch.end },
    };
    Transforms.delete(editor, { at: rangeToDelete });
  }
}
