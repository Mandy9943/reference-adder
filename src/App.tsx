import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardIcon } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useForm } from "./lib/hooks";
import {
  modifyReferences,
  randomNumber,
  separateByParagraphs,
} from "./lib/utils";
type OptionsType = "random" | "delete" | "replace";
export default function App() {
  const { handleChange, form, setState } = useForm();

  const [preview, setPreview] = useState("");

  const [editPreview, setEditPreview] = useState(false);

  const [option, setOption] = useState<OptionsType>("random");

  const handleInsertReferences = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const paragraphs = separateByParagraphs(form.mainText);

    const references = separateByParagraphs(form.references, 2);

    if (paragraphs.length < references.length) {
      alert(
        "The number of paragraphs should be greater than or equal to the number of references."
      );
      return;
    }

    console.log({ paragraphs });

    const excludeIndexes: number[] = [];

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.endsWith(": ") || paragraph.split(" ").length <= 11) {
        excludeIndexes.push(index);
      }
    });

    console.log({ excludeIndexes });

    // Select {references.length} random paragraphs
    const randomIndex: number[] = [];
    let count = 0;
    while (
      randomIndex.length < references.length &&
      count <= paragraphs.length
    ) {
      const random = randomNumber(0, paragraphs.length - 1);
      if (
        !randomIndex.includes(random) &&
        !randomIndex.includes(random - 1) &&
        !randomIndex.includes(random + 1) &&
        !excludeIndexes.includes(random)
      ) {
        randomIndex.push(random);
      }
      count++;
    }

    console.log({ randomIndex });

    // Insert a random reference after each selected paragraph
    const modifiedText = paragraphs.map((paragraph, index) => {
      if (randomIndex.includes(index)) {
        console.log(
          "end parragraph",
          paragraph.trim()[paragraph.trim().length - 1]
        );

        if (paragraph.trim().endsWith(".")) {
          return `${paragraph.trim().slice(0, -1)} ${
            references[randomNumber(0, references.length - 1)]
          }.`;
        } else {
          return `${paragraph} ${
            references[randomNumber(0, references.length - 1)]
          }.`;
        }
      }
      return paragraph;
    });

    // Join the paragraphs and references
    const joinedText = modifiedText.join("\n\n");

    if (option === "delete") {
      setPreview(modifyReferences(form.mainText, []));
    } else if (option === "replace") {
      setPreview(modifyReferences(form.mainText, references));
    } else {
      setPreview(joinedText);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "v" && form.mainText === "") {
        // Detecta Control+V
        navigator.clipboard.readText().then((clipText) => {
          console.log({ clipText });

          setState({
            ...form,
            mainText: clipText,
          });
        }); // Establece el texto del portapapeles en el textarea
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.mainText]);

  return (
    <main
      key="1"
      className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-50 dark:bg-gray-900"
    >
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Random References Inserter
        </h1>
        <div className="grid grid-cols-2 gap-6">
          <form className="grid gap-6">
            <div className="relative">
              <Textarea
                className={`h-60 ${form.mainText ? "" : "opacity-6"}`}
                id="main-text"
                placeholder=""
                onChange={handleChange}
                name="mainText"
                autoFocus
                value={form.mainText}
              />

              {!(form.mainText.length > 0) && (
                <div className="absolute top-0 left-0 right-0 w-full h-full flex justify-center items-center">
                  <div
                    key="1"
                    className=" w-[208px] h-[146px] flex items-center justify-center"
                  >
                    <button
                      className="flex flex-col items-center justify-center w-[208px] h-[146px] rounded-lg border-2 border-[#39ff14] hover:bg-[#e4e4e4] focus:ring-[#39ff14] font-semibold text-lg italic"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.readText().then((clipText) => {
                          setState({
                            ...form,
                            mainText: clipText,
                          });
                        }); // Establece el texto del portapapeles en el textarea
                      }}
                    >
                      <ClipboardIcon className="w-12 h-12 text-[#39ff14]" />
                      <span className="mt-2 text-[#39ff14] text-lg font-semibold italic">
                        Paste Text
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="references">References</Label>
              <Textarea
                className="h-24"
                id="references"
                placeholder="Paste your references here separated by blank lines..."
                onChange={handleChange}
                name="references"
              />
            </div>
            <div className="flex items-center justify-between">
              <Select
                defaultValue="random"
                onValueChange={(val: OptionsType) => setOption(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="random">Add random </SelectItem>
                    <SelectItem value="delete"> Find & delete</SelectItem>
                    <SelectItem value="replace">find & replace</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button onClick={handleInsertReferences}>
                {option === "random"
                  ? "Insert Random References"
                  : option === "delete"
                  ? "Delete References"
                  : "Replace References"}
              </Button>
            </div>
          </form>
          <div className=" rounded-lg overflow-auto grid gap-6">
            <ScrollArea className="h-96 w-full rounded-md border">
              <div className="p-4 text-sm relative">
                <Button
                  className="absolute right-2 top-2 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  variant="ghost"
                  onClick={() => {
                    setEditPreview((prev) => !prev);
                  }}
                >
                  Edit
                </Button>
                <h4 className="mb-4 text-lg font-medium leading-none">
                  Preview
                </h4>
                {editPreview ? (
                  <Textarea
                    className="h-60"
                    value={preview}
                    onChange={(e) => setPreview(e.target.value)}
                  />
                ) : (
                  <div className="flex flex-col">
                    {preview
                      ? preview
                          .split("\n\n")
                          .map((line, index) => (
                            <Highlighter
                              key={index}
                              textToHighlight={line}
                              searchWords={separateByParagraphs(
                                form.references,
                                2
                              )}
                              autoEscape={true}
                              className="mb-3"
                            ></Highlighter>
                          ))
                      : "Your text with inserted references will appear here."}
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex items-center justify-end p-2 border-t">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="mr-2"
                      variant="outline"
                      onClick={() => {
                        setPreview("");
                      }}
                    >
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
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(preview);
                        }}
                      >
                        Copy Modified Text
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
        </div>
      </div>
    </main>
  );
}
