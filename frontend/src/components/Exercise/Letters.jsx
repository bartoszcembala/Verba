/* eslint-disable react/prop-types */
function Letters({ inputValue, exercise, setInputValue, inputRef }) {
  const letters = ["á", "é", "í", "ó", "ú", "ñ"];
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2 text-[1.4rem]">
      {letters.map((letter) => (
        <span
          key={letter}
          onClick={() => {
            setInputValue((prev) => prev + letter);
            inputRef.current.focus();
          }}
          className="cursor-pointer rounded-md border border-neutral-300 px-3 py-2 font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {letter}
        </span>
      ))}{" "}
      <button
        className="cursor-pointer rounded-md border border-indigo-300 px-3 py-2 font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
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
        Hint
      </button>
    </div>
  );
}

export default Letters;
