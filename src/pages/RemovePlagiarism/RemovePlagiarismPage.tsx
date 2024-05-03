import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  text: string;
  system: string;
};
const RemovePlagiarismPage = () => {
  const [message, setMessage] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");

  const { register, watch, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      text: "",
      system: `Please take the following paragraph and rewrite it to eliminate plagiarism. Ensure that the core ideas and information remain intact. To achieve this, follow these steps:

Change the Words: Use synonyms and alternative expressions to convey the same meaning as the original text.
Rearrange Sentence Structure: Modify the order of words and the structure of sentences to make them unique compared to the original.
Reorder Sentences: Change the sequence of sentences within the paragraph to enhance uniqueness while maintaining logical flow and coherence.
Clarify and Condense: Where possible, make the text clearer or more concise without altering the essential information.
Your goal is to produce a new paragraph that communicates the same ideas as the original but in a completely original form. Please begin by showing the original paragraph followed by the rewritten version for comparison.  
     
paragraph to change:
`,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const finalPrompt = `${values.system}${values.text}`;
    setFinalPrompt(finalPrompt);

    const response = await fetch("http://93.127.202.227/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: finalPrompt,
        stream: true,
      }),
    });
    if (response.body) {
      const reader = response.body.getReader();
      let responseString = "";
      reader.read().then(function processText({ done, value }) {
        if (done) {
          setMessage(responseString);
          console.log("Stream finished.");
          return;
        }

        const chunk = new TextDecoder().decode(value);
        responseString += chunk;
        setMessage(responseString); // This updates state for every chunk received
        console.log(chunk);
        reader.read().then(processText);
      });
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-10"
      >
        <div>
          <Label>Prompt</Label>
          <Textarea
            {...register("system")}
            value={watch("system")}
            className="w-full h-60"
          />
        </div>

        <div>
          <Label>Text</Label>

          <Textarea {...register("text")} className="w-full h-64" />
        </div>
        {finalPrompt.length > 0 && (
          <div>
            <Label>Final Prompt</Label>

            <Textarea value={finalPrompt} className="w-full h-64" />
          </div>
        )}

        <Button type="submit">Rephrase</Button>
      </form>

      {message.length > 0 && (
        <div>
          <div className="mt-16">
            <h2 className="text-xl font-bold text-center">Result</h2>
            <p>{message}</p>
          </div>

          <Button
            className="mt-8"
            onClick={() => {
              navigator.clipboard.writeText(message);
            }}
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
};

export default RemovePlagiarismPage;
