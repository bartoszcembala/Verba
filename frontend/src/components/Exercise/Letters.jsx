/* eslint-disable react/prop-types */
function Letters({ setInputValue, inputRef }) {
  const letters = ["á", "é", "í", "ó", "ú", "ñ"];
  return (
    <div className="lettersContainer">
      {letters.map((letter) => (
        <span
          key={letter}
          onClick={() => {
            setInputValue((prev) => prev + letter);
            inputRef.current.focus();
          }}
          className="btn letterBtn"
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

export default Letters;
