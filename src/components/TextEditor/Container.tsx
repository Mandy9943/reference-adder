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

  const onCopy = useCallback(() => {
    // Obtiene el texto actual del editor como un solo string
    const text = getTextFromNodes(editor.children);
    // Utiliza la API del portapapeles del navegador para copiar el texto
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Manejo opcional de éxito, como mostrar un mensaje
        console.log("Contenido copiado con éxito!");
      })
      .catch((err) => {
        // Manejo opcional de errores
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
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset all the input fields and the preview panel.</p>
            </TooltipContent>
          </Tooltip>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onCopy}>Copy Modified Text</Button>
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
