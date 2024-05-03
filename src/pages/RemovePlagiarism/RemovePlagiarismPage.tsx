import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// const ollama = new Ollama({ host: "https://pinocli.com" });

type Inputs = {
  text: string;
  system: string;
};
const RemovePlagiarismPage = () => {
  const [message, setMessage] = useState("");

  const { register, watch, setValue, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      text: "",
      system: `Please take the following paragraph and rewrite it to eliminate plagiarism. Ensure that the core ideas and information remain intact. To achieve this, follow these steps:

Change the Words: Use synonyms and alternative expressions to convey the same meaning as the original text.
Rearrange Sentence Structure: Modify the order of words and the structure of sentences to make them unique compared to the original.
Reorder Sentences: Change the sequence of sentences within the paragraph to enhance uniqueness while maintaining logical flow and coherence.
Clarify and Condense: Where possible, make the text clearer or more concise without altering the essential information.
Your goal is to produce a new paragraph that communicates the same ideas as the original but in a completely original form. Please begin by showing the original paragraph followed by the rewritten version for comparison.  

Never show the original paragraph. Never show what steps you provided. Never say "Here is the rewritten paragraph:" or anything related to this.
      
paragraph to change:
`,
    },
  });

  // const onSubmit: SubmitHandler<Inputs> = async (values) => {
  //   const finalPrompt = `${values.system}${values.text}`;

  //   // direct ollama sdk
  //   // const response = await ollama.generate({
  //   //   model: "llama3",
  //   //   prompt: finalPrompt,
  //   //   stream: true,
  //   // });
  //   // for await (const part of response) {
  //   //   setMessage((prev) => prev + part.response);
  //   // }

  //   // with express app
  //   const response = await fetch("https://pinocli.com/generate", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Transfer-Encoding": "chunked",
  //     },
  //     body: JSON.stringify({
  //       model: "llama3",
  //       prompt: finalPrompt,
  //       stream: true,
  //     }),
  //   });
  //   if (response.body) {
  //     const reader = response.body.getReader();
  //     let responseString = "";
  //     reader.read().then(function processText({ done, value }) {
  //       if (done) {
  //         setMessage(responseString);
  //         console.log("Stream finished.");
  //         return;
  //       }

  //       const chunk = new TextDecoder().decode(value);
  //       responseString += chunk;
  //       setMessage(responseString); // This updates state for every chunk received
  //       console.log(chunk);
  //       reader.read().then(processText);
  //     });
  //   }
  // };

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const paragraphs = values.text.split("\n\n").filter((p) => p.trim() !== ""); // Dividir el texto en párrafos y filtrar los vacíos
    const finalResult = "";
    console.log(paragraphs);
    let responseString = "";

    for (const paragraph of paragraphs) {
      const finalPrompt = `${values.system}${paragraph}`; // Asegúrate de que esta es la manera en que quieres construir el prompt

      const response = await fetch("http://localhost:4545/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Transfer-Encoding": "chunked",
        },
        body: JSON.stringify({
          model: "llama3",
          prompt: finalPrompt,
          stream: true,
        }),
      });

      if (response.body) {
        const reader = response.body.getReader();

        await new Promise((resolve, reject) => {
          reader.read().then(function processText({ done, value }) {
            if (done) {
              responseString += "\n\n"; // Concatenar el resultado de este párrafo al resultado final
              console.log(responseString);

              setMessage(responseString); // Actualizar el mensaje después de cada párrafo

              resolve();
              return;
            }

            const chunk = new TextDecoder().decode(value);
            responseString += chunk; // Acumular chunks del mismo párrafo
            setMessage(responseString);
            reader.read().then(processText);
          });
        });
      }
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-10"
      >
        <div className="relative">
          <Textarea {...register("text")} className="w-full h-64" />

          {!(watch("text", "").length > 0) && (
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
                      setValue("text", clipText);
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

        <Button type="submit">Rephrase</Button>
      </form>

      {message.length > 0 && (
        <div>
          <div className="mt-16">
            <h2 className="text-xl font-bold text-center">Result</h2>
            <div className="flex flex-col gap-3">
              {message.split("\n\n").map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
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
