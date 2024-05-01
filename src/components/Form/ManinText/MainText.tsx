import { Textarea } from "@/components/ui/textarea";
import { ClipboardIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

const MainText = () => {
  console.log("render MainText");

  const { watch, register, setValue } = useFormContext();
  return (
    <div className="relative">
      <Textarea
        className={`h-60`}
        id="main-text"
        placeholder=""
        autoFocus
        {...register("mainText")}
      />

      {!(watch("mainText", "").length > 0) && (
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
                  setValue("mainText", clipText);
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
  );
};

export default MainText;
