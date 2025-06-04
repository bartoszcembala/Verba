/* eslint-disable react/prop-types */
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { useAddLearnedWord } from "../../lib/queries/progressQueries";
import { handleAnswer } from "../../lib/exerciseFns/handleAnswer";
import {
  getExerciseFill,
  getExerciseTranslate,
} from "../../lib/exerciseFns/exericsesFn";
import { ExerciseContext } from "../../lib/contexts";

function Main({ account, setAccount, setCorrect }) {
  const {
    mode,
    selectedVerbs,
    setSelectedVerbs,
    verbs,
    progress,
    module,
    user,
  } = useContext(ExerciseContext);

  const { addLearnedWord } = useAddLearnedWord();
  const queryClient = useQueryClient();
  const [exercise, setExercise] = useState({
    question: "",
    translation: "Tłumaczenie pytania",
    correctAnswer: "",
    options: ["opcja1", "opcja2", "opcja3", "opcja4"],
  });
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState("");
  const inputRef = useRef(null);
  const [exerciseType, setExerciseType] = useState("translate");
  const letters = ["á", "é", "í", "ó", "ú", "ñ"];
  const [showTranslation, setShowTranslation] = useState(false);
  const [writing, setWriting] = useState(true);

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isCorrect === "" || isCorrect === "wrong") {
        handleAnswer(
          inputValue,
          addLearnedWord,
          mode,
          progress,
          module,
          user,
          exercise,
          setIsCorrect,
          account,
          setAccount,
          setCorrect,
          setSelectedVerbs,
          queryClient
        );
      } else if (isCorrect === "correct") {
        getExerciseTranslate(
          setInputValue,
          setIsCorrect,
          setExercise,
          verbs,
          selectedVerbs
        );
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center border-3 border-solid border-neutral-300 rounded-2xl py-10 px-10 h-[60rem]">
      {selectedVerbs.length === 0 ? (
        <p>Add words to start</p>
      ) : exercise.correctAnswer === "" ? (
        <button
          className="btn"
          onClick={() =>
            exerciseType === "translate"
              ? getExerciseTranslate(
                  setInputValue,
                  setIsCorrect,
                  setExercise,
                  verbs,
                  selectedVerbs
                )
              : getExerciseFill(
                  setInputValue,
                  setIsCorrect,
                  setExercise,
                  selectedVerbs
                )
          }
        >
          Get an exercise
        </button>
      ) : (
        <>
          <h2>
            {exercise.question}{" "}
            <span onClick={() => setShowTranslation(!showTranslation)}>
              TRANSLATE
            </span>
          </h2>
          <p className="translation">
            {showTranslation && exercise.translation}
          </p>
          {writing ? (
            <div className="inputContainer">
              <button
                className="btn toggleBtn"
                onClick={() => setWriting(false)}
              >
                🔠
              </button>
              <input
                className="input"
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer"
              />
              {isCorrect === "correct" || isCorrect === "wrong" ? (
                <button
                  className="btn checkBtn"
                  onClick={() =>
                    exerciseType === "translate"
                      ? getExerciseTranslate(
                          setInputValue,
                          setIsCorrect,
                          setExercise,
                          verbs,
                          selectedVerbs
                        )
                      : getExerciseFill(
                          setInputValue,
                          setIsCorrect,
                          setExercise,
                          selectedVerbs
                        )
                  }
                >
                  ➡
                </button>
              ) : (
                <button
                  className="btn checkBtn"
                  onClick={() =>
                    handleAnswer(
                      inputValue,
                      addLearnedWord,
                      mode,
                      progress,
                      module,
                      user,
                      exercise,
                      setIsCorrect,
                      account,
                      setAccount,
                      setCorrect,
                      setSelectedVerbs,
                      queryClient
                    )
                  }
                >
                  Check answer
                </button>
              )}
            </div>
          ) : (
            <div className="answersContainer">
              <button
                className="btn toggleBtn"
                onClick={() => setWriting(true)}
              >
                ✍
              </button>
              {exercise.options.map((answer) => (
                <div
                  onClick={() =>
                    handleAnswer(
                      answer,
                      addLearnedWord,
                      mode,
                      progress,
                      module,
                      user,
                      exercise,
                      setIsCorrect,
                      account,
                      setAccount,
                      setCorrect,
                      setSelectedVerbs,
                      queryClient
                    )
                  }
                  key={answer}
                  className="answer"
                >
                  {answer}
                </div>
              ))}
            </div>
          )}
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
          <div className="buttons">
            {/* <button
          className="btn"
          onClick={() => setShowTranslation(!showTranslation)}
        >
          Translation {exercise.answer}
        </button> */}

            <button
              className="btn"
              onClick={() =>
                exerciseType === "translate"
                  ? getExerciseTranslate(
                      setInputValue,
                      setIsCorrect,
                      setExercise,
                      verbs,
                      selectedVerbs
                    )
                  : getExerciseFill(
                      setInputValue,
                      setIsCorrect,
                      setExercise,
                      selectedVerbs
                    )
              }
            >
              Get an exercise
            </button>
          </div>{" "}
        </>
      )}
      <div className="mt-4">
        <button onClick={() => setExerciseType("translate")} className="btn">
          Translate the Word
        </button>
        <button onClick={() => setExerciseType("fillblank")} className="btn">
          Fill the Blank
        </button>
      </div>
    </div>
  );
}

export default Main;
