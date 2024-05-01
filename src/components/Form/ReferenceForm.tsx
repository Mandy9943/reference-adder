import { randomNumber, separateByParagraphs } from "@/lib/utils";
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

  const methods = useForm<Inputs>({
    defaultValues: {
      mainText: "",
      option: "replace",
      references: "",
    },
  });
  const { handleSubmit, setValue, getValues } = methods;
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);

    const paragraphs = separateByParagraphs(data.mainText);

    let references = separateByParagraphs(data.references, 2);

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

    // Insert a random reference after each selected paragraph
    const modifiedText = paragraphs.map((paragraph, index) => {
      if (randomIndex.includes(index)) {
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
    console.log(joinedText);

    //   if (option === "delete") {
    //     // removeReferences(form.mainText);
    //   } else if (option === "replace") {
    //     setPreview(
    //       stringToEditorValue(replaceReferences(form.mainText, references))
    //     );
    //   } else {
    //     setPreview(stringToEditorValue(joinedText));
    //   }
  };

  return (
    <FormProvider {...methods}>
      <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        <MainText />
        <ReferenceText />
        <AdderOptions
          option={getValues("option")}
          setOption={(val: AdderOptionsType) => setValue("option", val)}
        />
      </form>
    </FormProvider>
  );
};

export default ReferenceForm;
