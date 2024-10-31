import { useAppDispatch } from "@/hooks/useRedux";
import {
  deleteReferences,
  replaceReferences,
  separateByParagraphs,
} from "@/lib/utils";
import {
  updateReferencesForEditor,
  updateTextForEditor,
} from "@/redux/slices/appSlice";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import AdderOptions, { AdderOptionsType } from "./AdderOptions/AdderOptions";
import MainText from "./ManinText/MainText";
import ReferenceText from "./ReferenceText/ReferenceText";

type Inputs = {
  mainText: string;
  references: string;
  option: AdderOptionsType;
};
const ReferenceForm = () => {
  console.log("render ReferenceForm");
  const dispatch = useAppDispatch();
  const methods = useForm<Inputs>({
    defaultValues: {
      mainText: "",
      option: "random",
      references: "",
    },
  });
  const { handleSubmit, setValue, reset } = methods;

  const resetForm = () => {
    reset();
    dispatch(updateTextForEditor(""));
    dispatch(updateReferencesForEditor([]));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).resetReferenceForm = resetForm;

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);

    const paragraphs = separateByParagraphs(data.mainText);

    let references = separateByParagraphs(data.references.trim(), 2);
    references = references.map((reference) => reference.trim());
    console.log(references);

    if (paragraphs.length < references.length) {
      references = references.slice(0, paragraphs.length);
    }

    console.log({ paragraphs });

    const excludeIndexes: number[] = [];

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.endsWith(": ") || paragraph.split(" ").length <= 11) {
        excludeIndexes.push(index);
      }
    });

    console.log({ excludeIndexes });

    const randomIndex: number[] = [];
    const availableIndexes = Array.from(
      { length: paragraphs.length },
      (_, i) => i
    ).filter((index) => !excludeIndexes.includes(index));

    // Shuffle available indexes
    const shuffledIndexes = [...availableIndexes];
    for (let i = shuffledIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIndexes[i], shuffledIndexes[j]] = [
        shuffledIndexes[j],
        shuffledIndexes[i],
      ];
    }

    // Take all available indexes
    randomIndex.push(...shuffledIndexes);
    randomIndex.sort((a, b) => a - b);

    // Insert references, using all available ones first, then reusing if necessary
    const usedReferences = new Set<number>();
    const modifiedText = paragraphs.map((paragraph, index) => {
      if (randomIndex.includes(index)) {
        let referenceIndex: number;

        // First try to use unused references
        if (usedReferences.size < references.length) {
          // Get a random unused reference
          const unusedReferences = Array.from(
            Array(references.length).keys()
          ).filter((i) => !usedReferences.has(i));
          referenceIndex =
            unusedReferences[
              Math.floor(Math.random() * unusedReferences.length)
            ];
          usedReferences.add(referenceIndex);
        } else {
          // If all references have been used, pick randomly
          referenceIndex = Math.floor(Math.random() * references.length);
        }

        if (paragraph.trim().endsWith(".")) {
          return `${paragraph.trim().slice(0, -1)} ${
            references[referenceIndex]
          }.`;
        } else {
          return `${paragraph} ${references[referenceIndex]}.`;
        }
      }
      return paragraph;
    });

    // Join the paragraphs and references
    const joinedText = modifiedText.join("\n\n");

    if (data.option === "delete") {
      dispatch(updateTextForEditor(deleteReferences(data.mainText)));
    } else if (data.option === "replace") {
      const textUpdated = replaceReferences(data.mainText, references);

      dispatch(updateTextForEditor(textUpdated));
    } else {
      dispatch(updateTextForEditor(joinedText));
    }
    dispatch(updateReferencesForEditor(references));
  };

  return (
    <FormProvider {...methods}>
      <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        <MainText />
        <ReferenceText />
        <AdderOptions
          setOption={(val: AdderOptionsType) => setValue("option", val)}
        />
      </form>
    </FormProvider>
  );
};

export default ReferenceForm;
