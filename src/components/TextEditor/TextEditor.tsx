/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/hooks/useRedux";
import { stringToEditorValue } from "@/lib/utils";
import { selectReferencesForEditor } from "@/redux/slices/appSlice";
import { useCallback } from "react";
import { Text } from "slate";
import { Editable, ReactEditor, Slate } from "slate-react";
import Leaf from "./Leaf";

const TextEditor = ({
  preview,
  editor,
}: {
  preview: string;
  editor: ReactEditor;
}) => {
  const references = useAppSelector(selectReferencesForEditor);

  console.log(editor);

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
        console.log({ reference });

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

  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div>
      <Slate editor={editor} initialValue={stringToEditorValue(preview)}>
        <Editable decorate={decorate} renderLeaf={renderLeaf} className="p-2" />
      </Slate>
    </div>
  );
};

export default TextEditor;
