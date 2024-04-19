import { separateByParagraphs } from "@/lib/utils";
import React, { useEffect } from "react";
import Highlighter from "react-highlight-words";

const Marker = ({
  line,
  highlight,
  onClickHighlighted,
}: {
  line: string;
  highlight: string;
  onClickHighlighted: (removeString: string) => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const unhighlighted = ref.current.querySelector(".unhighlighted");

      const regex = /\w+\s\(\d{4}\)/;

      if (unhighlighted && unhighlighted?.textContent) {
        const unhigligterWithReplacement = unhighlighted.textContent.replace(
          regex,
          (match) => {
            return `<span class="bg-green-200">${match}</span>`;
          }
        );

        unhighlighted.innerHTML = unhigligterWithReplacement;
      }

      // search for the mark tag in the ref
      const mark = ref.current.querySelector("mark");

      // if the mark tag is found, add click event listener
      if (mark) {
        // text inside mark
        const text = mark.textContent;
        if (text) {
          mark.addEventListener("click", () => onClickHighlighted(text));
        }
      }

      // return the cleanup function
      return () => {
        if (mark) {
          const text = mark.textContent;
          if (text) {
            mark.removeEventListener("click", () => onClickHighlighted(text));
          }
        }
      };
    }
  }, [onClickHighlighted]);

  return (
    <div ref={ref} className="mb-3">
      {" "}
      <Highlighter
        textToHighlight={line}
        searchWords={separateByParagraphs(highlight, 2)}
        autoEscape={true}
        highlightClassName="bg-yellow-200 cursor-pointer"
        unhighlightClassName="unhighlighted"
      ></Highlighter>
    </div>
  );
};

export default Marker;
