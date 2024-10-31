import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useRedux";
import { getTextFromNodes } from "@/lib/utils";
import { selectTextForEditor } from "@/redux/slices/appSlice";
import { useCallback, useState } from "react";
import { createEditor } from "slate";
import { withReact } from "slate-react";
import { ScrollArea } from "../ui/scroll-area";
import TextEditor from "./TextEditor";
const Container = () => {
  const preview = useAppSelector(selectTextForEditor);
  const [editor] = useState(() => withReact(createEditor()));
  const [copySuccess, setCopySuccess] = useState(false);

  const onCopy = useCallback(() => {
    const text = getTextFromNodes(editor.children);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Error al copiar el contenido: ", err);
      });
  }, [editor]);

  const handleDelete = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).resetReferenceForm?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor.children as any) = [
      { type: "paragraph", children: [{ text: "" }] },
    ];
  };

  return (
    <div className=" rounded-lg overflow-auto grid gap-6">
      <ScrollArea className="h-96 w-full rounded-md border">
        <div className="p-4 text-sm relative">
          <h4 className="mb-4 text-lg font-medium leading-none">Preview</h4>

          <div className="flex flex-col">
            <TextEditor key={preview} preview={preview} editor={editor} />
          </div>
        </div>
      </ScrollArea>
      <div className="flex items-center justify-end p-2 border-t">
        <Button className="mr-2" variant="outline" onClick={handleDelete}>
          Delete
        </Button>

        <Button
          onClick={onCopy}
          className={`relative ${
            copySuccess ? "bg-green-600 hover:bg-green-700" : ""
          }`}
        >
          {copySuccess ? "Copied!" : "Copy text"}
        </Button>
      </div>
    </div>
  );
};

export default Container;
