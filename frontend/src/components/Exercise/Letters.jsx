/* eslint-disable react/prop-types */
function Letters({ inputValue, exercise, setInputValue, inputRef }) {
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
      ))}{" "}
      <button
        className="cursor-pointer   px-4 py-2 rounded-2xl  shadow-[0_0_20px_rgba(34,0,120,0.9)] border-indigo-700 border-2 hover:scale-102 hover:bg-neutral-800 transition"
        onClick={() => {
          const correct = exercise.correctAnswer;
          const current = inputValue;

          // znajdź pierwszy indeks gdzie litery się różnią
          let firstWrongIndex = -1;
          for (let i = 0; i < current.length; i++) {
            if (current[i] !== correct[i]) {
              firstWrongIndex = i;
              break;
            }
          }

          if (firstWrongIndex !== -1) {
            // zamień błędną literę na poprawną
            setInputValue(
              current.slice(0, firstWrongIndex) + correct[firstWrongIndex],
            );
          } else {
            // brak błędów — dodaj kolejną literę
            setInputValue(
              current + correct.slice(current.length, current.length + 1),
            );
          }

          inputRef.current.focus();
        }}
      >
        HINT
      </button>
    </div>
  );
}

export default Letters;
