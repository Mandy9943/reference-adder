import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="mr-2" variant="outline">
                Delete
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset all the input fields and the preview panel.</p>
            </TooltipContent>
          </Tooltip>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onCopy}
                  className={`relative ${
                    copySuccess ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                >
                  {copySuccess ? "Copied!" : "Copy Modified Text"}
                  {copySuccess && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white animate-fade-in"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download the text with inserted references.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Container;
