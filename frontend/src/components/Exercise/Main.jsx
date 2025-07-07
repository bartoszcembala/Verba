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
  console.log(exercise);
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
    <div className="overflow-hidden w-[90%] h-[38rem] lg:h-[85vh] ">
      <div
        className={`relative flex flex-col items-center rounded-2xl border-neutral-300  border-1  dark:border-none  lg:py-24 py-14  px-10 lg:h-[60rem] transition-colors duration-300 ease-in-out  ${
          isCorrect === "" && "bg-white dark:bg-neutral-700/70"
        } ${isCorrect === "correct" && "bg-[#323a34]"} ${
          isCorrect === "wrong" && "bg-[#3a3232]"
        }`}
      >
        {selectedVerbs.length === 0 ? (
          <p className="text-7xl mt-30 uppercase">Add words to start</p>
        ) : exercise.correctAnswer === "" ? (
          <button
            className="cursor-pointer text-7xl mt-30 uppercase"
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
            Start
          </button>
        ) : (
          <>
            <h2 className="text-5xl lg:mb-26 mb-10 lg:mt-26">
              {exercise.question}{" "}
              <span onClick={() => setShowTranslation(!showTranslation)}>
                TRANSLATE
              </span>
            </h2>
            <p className="translation">
              {showTranslation && exercise.correctAnswer}
            </p>
            {writing ? (
              <div className="text-5xl flex">
                <button
                  className="cursor-pointer w-[10%]"
                  onClick={() => setWriting(false)}
                >
                  🔠
                </button>
                <input
                  className="w-[70%] dark:bg-neutral-600 bg-neutral-200  border-1 border-neutral-300 dark:border-none rounded-xl px-5 py-3 mx-3"
                  type="text"
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer"
                />
                {isCorrect === "correct" || isCorrect === "wrong" ? (
                  <button
                    className="w-[20%]"
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
                    className="cursor-pointer"
                    onClick={() => handleAnswer(inputValue)}
                  >
                    CHECK
                  </button>
                )}
              </div>
            ) : (
              <div className="">
                <button className="" onClick={() => setWriting(true)}>
                  ✍
                </button>
                {exercise.options.map((answer) => (
                  <div
                    onClick={() => handleAnswer(answer)}
                    key={answer}
                    className=""
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
                className="border-1 cursor-pointer border-neutral-300  transition-colors px-4 py-2 rounded-xl mt-10 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                onClick={() =>
                  exerciseType === "translate"
                    ? getExercise("translate")
                    : getExercise("fill")
                }
              >
                Skip
              </button>
            </div>{" "}
          </>
        )}
        <div className="absolute -bottom-24 lg:bottom-6">
          <button
            onClick={() => setExerciseType("translate")}
            className="border-1 cursor-pointer border-neutral-300  transition-colors px-4 py-2 rounded-xl mr-4  hover:bg-neutral-200 dark:hover:bg-neutral-600 "
          >
            Translate the Word
          </button>
          <button
            onClick={() => setExerciseType("fillblank")}
            className="border-1 cursor-pointer border-neutral-300  transition-colors px-4 py-2 rounded-xl mr-4  hover:bg-neutral-200 dark:hover:bg-neutral-600"
          >
            Fill the Blank
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
