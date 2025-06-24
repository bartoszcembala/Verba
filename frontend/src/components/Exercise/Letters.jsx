/* eslint-disable react/prop-types */
function Letters({ setInputValue, inputRef }) {
  const letters = ["á", "é", "í", "ó", "ú", "ñ"];
  return (
    <div className="flex gap-3 text-4xl mt-10">
      {letters.map((letter) => (
        <span
          key={letter}
          onClick={() => {
            setInputValue((prev) => prev + letter);
            inputRef.current.focus();
          }}
          className="hover:bg-neutral-200 dark:hover:bg-neutral-600 border-1 cursor-pointer border-neutral-300  transition-colors px-4 py-2 rounded-xl"
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

export default Letters;
