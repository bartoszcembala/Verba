/* eslint-disable react/prop-types */
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { useAddLearnedWord } from "../../lib/queries/progressQueries";
import { handleAnswer as handleAnswerImported } from "../../lib/exerciseFns/handleAnswer";
import {
  getExerciseFill,
  getExerciseTranslate,
} from "../../lib/exerciseFns/exericsesFn";
import { ExerciseContext } from "../../lib/contexts";
import Letters from "./Letters";
import {
  useEditDailyQuests,
  useGetDailyQuests,
} from "../../lib/queries/dailyQuestsQueries";
import { useUpdateDailyQuests } from "../../lib/useUpdateDailyQuests";

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

  const { dailyQuests } = useGetDailyQuests();
  const { editDailyQuests } = useEditDailyQuests();
  const { addLearnedWord } = useAddLearnedWord();
  const { handleUpdateDailyQuest } = useUpdateDailyQuests();
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
  const [showTranslation, setShowTranslation] = useState(false);
  const [writing, setWriting] = useState(true);

  function getExercise(type) {
    if (type === "translate") {
      getExerciseTranslate(
        setInputValue,
        setIsCorrect,
        setExercise,
        verbs,
        selectedVerbs
      );
    }

    if (type === "fill") {
      getExerciseFill(setInputValue, setIsCorrect, setExercise, selectedVerbs);
    }
  }

  function handleAnswer(input) {
    handleAnswerImported(
      input,
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
      queryClient,
      dailyQuests,
      editDailyQuests,
      handleUpdateDailyQuest
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isCorrect === "" || isCorrect === "wrong") {
        handleAnswer(inputValue);
      } else if (isCorrect === "correct") {
        getExercise("translate");
      }
    }
  }

  return (
    <div className="overflow-hidden h-[85vh] ">
      <div
        className={`flex flex-col items-center justify-center border-3 border-solid border-neutral-300 rounded-2xl py-10 px-10 h-[60rem] transition-colors duration-300 ease-in-out  ${
          isCorrect === "" && "bg-neutral-700"
        } ${isCorrect === "correct" && "bg-[#323a34]"} ${
          isCorrect === "wrong" && "bg-[#3a3232]"
        }`}
      >
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
                        ? getExercise("translate")
                        : getExercise("fill")
                    }
                  >
                    ➡
                  </button>
                ) : (
                  <button
                    className="btn checkBtn"
                    onClick={() => handleAnswer(inputValue)}
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
                    onClick={() => handleAnswer(answer)}
                    key={answer}
                    className="answer"
                  >
                    {answer}
                  </div>
                ))}
              </div>
            )}
            <Letters inputRef={inputRef} setInputValue={setInputValue} />
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
                    ? getExercise("translate")
                    : getExercise("fill")
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
    </div>
  );
}

export default Main;
