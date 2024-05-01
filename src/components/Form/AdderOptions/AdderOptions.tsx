import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memo } from "react";

export type AdderOptionsType = "random" | "delete" | "replace";

const AdderOptions = ({
  setOption,
  option,
}: {
  setOption: (value: AdderOptionsType) => void;
  option: AdderOptionsType;
}) => {
  console.log("render AdderOptions");

  return (
    <div>
      <div className="flex items-center justify-between">
        <Select
          defaultValue="random"
          onValueChange={(val: AdderOptionsType) => setOption(val)}
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
        <Button type="submit">
          {option === "random"
            ? "Insert Random References"
            : option === "delete"
            ? "Delete References"
            : "Replace References"}
        </Button>
      </div>
    </div>
  );
};

export default memo(AdderOptions);
