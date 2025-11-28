/* eslint-disable react/prop-types */
function Letters({ setInputValue, inputRef }) {
  const letters = ["á", "é", "í", "ó", "ú", "ñ"];
  return (
    <div className="flex gap-3 text-4xl lg:mt-10 mt-4">
      {letters.map((letter) => (
        <span
          key={letter}
          onClick={() => {
            setInputValue((prev) => prev + letter);
            inputRef.current.focus();
          }}
          className="   cursor-pointer   px-4 py-2 rounded-2xl bg-indigo-500 shadow-[0_0_20px_rgba(34,0,120,0.9)] border-indigo-700 border-1 hover:scale-102 hover:bg-indigo-600 transition"
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

export default Letters;
