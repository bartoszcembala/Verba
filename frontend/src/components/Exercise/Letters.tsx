import type { RefObject } from "react";
type LettersProps = {
  onAppend: (character: string) => void;
  onHint: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

function Letters({ onAppend, onHint, inputRef }: LettersProps) {
  const letters = ["á", "é", "í", "ó", "ú", "ñ"];
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2 text-[1.4rem]">
      {letters.map((letter) => (
        <span
          key={letter}
          onClick={() => {
            onAppend(letter);
            inputRef.current?.focus();
          }}
          className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {letter}
        </span>
      ))}{" "}
      <button
        className="cursor-pointer rounded-md border border-indigo-300 px-3 py-2 font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
        onClick={() => {
          onHint();
          inputRef.current?.focus();
        }}
      >
        Hint
      </button>
    </div>
  );
}

export default Letters;
