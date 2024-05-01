import { useAppSelector } from "@/hooks/useRedux";
import { selectTextForEditor } from "@/redux/slices/appSlice";
import { ScrollArea } from "../ui/scroll-area";
import TextEditor from "./TextEditor";

const Container = () => {
  const preview = useAppSelector(selectTextForEditor);
  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <div className="p-4 text-sm relative">
        <h4 className="mb-4 text-lg font-medium leading-none">Preview</h4>

        <div className="flex flex-col">
          <TextEditor key={preview} preview={preview} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Container;
