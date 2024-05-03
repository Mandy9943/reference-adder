import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

const ReferenceText = () => {
  console.log("render ReferenceText");

  const { register } = useFormContext();
  return (
    <div>
      <Label htmlFor="references">References</Label>
      <Textarea
        className="h-24"
        id="references"
        placeholder="Paste your references here separated by blank lines..."
        {...register("references")}
      />
    </div>
  );
};

export default ReferenceText;
