/* eslint-disable @typescript-eslint/no-explicit-any */
import { stringToEditorValue } from "@/lib/utils";
import { useCallback, useState } from "react";
import { Text, createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import Leaf from "./Leaf";

function TextEditor({ preview }: { preview: string }) {
  const references = [""];
  console.log("render TextEditor");

  const [editor] = useState(() => withReact(createEditor()));

  const decorate = useCallback(
    ([node, path]: any) => {
      const ranges: any[] = [];

      if (!Text.isText(node)) {
        return ranges;
      }

      const { text } = node;
      const regex = /\w+\s\(\d{4}\)/g; // Define la expresión regular para buscar coincidencias
      const parts = [...text.matchAll(regex)];

      for (const part of parts) {
        console.log(part);
        const start = part.index;
        if (start) {
          const end = start + part[0].length;
          const range = {
            anchor: { path, offset: start },
            focus: { path, offset: end },
            highlightGreen: true,
            end: end,
          };
          ranges.push(range);
        }
      }

      // Highlight yellow inserted references
      references.forEach((reference) => {
        // regex from reference text
        const referenceRegex = new RegExp(reference, "g");
        const referenceParts = [...text.matchAll(referenceRegex)];

        for (const part of referenceParts) {
          const start = part.index;
          if (start) {
            const end = start + part[0].length;
            const range = {
              anchor: { path, offset: start },
              focus: { path, offset: end },
              highlightYellow: true,
              end: end,
            };
            ranges.push(range);
          }
        }
      });

      return ranges;
    },
    [references]
  );

  const renderLeaf = useCallback(
    (props: any) => {
      return <Leaf {...props} />;
    },
    [references]
  );

  return (
    <Slate editor={editor} initialValue={stringToEditorValue(preview)}>
      <Editable decorate={decorate} renderLeaf={renderLeaf} className="p-2" />
    </Slate>
  );
}

export default TextEditor;
