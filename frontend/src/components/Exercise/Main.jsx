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
  useIncrementDailyQuest,
} from "../../lib/queries/dailyQuestsQueries";
import { FiCheckSquare } from "react-icons/fi";
import { useEditUser } from "../../lib/queries/userQueries";

function Main({ setCorrect }) {
  const { selectedVerbs, setSelectedVerbs, verbs, progress, module, user } =
    useContext(ExerciseContext);
  const { editUser } = useEditUser();
  const { dailyQuests } = useGetDailyQuests();
  const { editDailyQuests } = useEditDailyQuests();
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
  const [showTranslation, setShowTranslation] = useState(false);
  const [writing, setWriting] = useState(true);
  const { incrementDailyQuest } = useIncrementDailyQuest();

  function getExercise(type) {
    if (type === "translate") {
      getExerciseTranslate(
        setInputValue,
        setIsCorrect,
        setExercise,
        verbs,
        selectedVerbs,
      );
    }

    if (type === "fill") {
      getExerciseFill(setInputValue, setIsCorrect, setExercise, selectedVerbs);
    }
  }

  function handleAnswer(input) {
    handleAnswerImported(
      editUser,
      input,
      addLearnedWord,
      setExercise,
      selectedVerbs,
      progress,
      module,
      user,
      exercise,
      setIsCorrect,
      setCorrect,
      setSelectedVerbs,
      queryClient,
      dailyQuests,
      editDailyQuests,
      incrementDailyQuest,
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
    <div className="w-full">
      <div
        className="relative flex min-h-[48rem] flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-10 dark:border-neutral-800 dark:bg-neutral-900"
      >
        {selectedVerbs.length === 0 ? (
          <div className="text-center"><h2 className="text-[2.4rem] font-semibold">Choose words to begin</h2><p className="mt-2 text-[1.4rem] text-neutral-500">Add at least one word from the list.</p></div>
        ) : exercise.correctAnswer === "" ? (
          <button
            className="cursor-pointer rounded-lg bg-indigo-600 px-8 py-4 text-[1.6rem] font-semibold text-white hover:bg-indigo-700"
            onClick={() =>
              exerciseType === "translate"
                ? getExerciseTranslate(
                    setInputValue,
                    setIsCorrect,
                    setExercise,
                    verbs,
                    selectedVerbs,
                  )
                : getExerciseFill(
                    setInputValue,
                    setIsCorrect,
                    setExercise,
                    selectedVerbs,
                  )
            }
          >
            Start practice
          </button>
        ) : (
          <>
            <p className="mb-3 text-[1.25rem] font-medium text-neutral-500">Translate this word</p>
            <h2 className="mb-10 text-center text-[3.4rem] font-semibold">
              {exercise.question}{" "}
              {/* <span onClick={() => setShowTranslation(!showTranslation)}>
                TRANSLATE
              </span> */}
            </h2>
            <p className="translation">
              {showTranslation && exercise.correctAnswer}
            </p>
            {writing ? (
              <div className="flex w-full max-w-[54rem] flex-col items-stretch justify-center gap-3 sm:flex-row">
                <span
                  className={`flex flex-1 items-center gap-3 rounded-lg border px-4 ${isCorrect === "correct" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : isCorrect === "wrong" ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-neutral-300 dark:border-neutral-700"}`}
                >
                  <button
                    className="cursor-pointer text-neutral-400"
                    onClick={() => setWriting(false)}
                  >
                    <FiCheckSquare />
                  </button>
                  <input
                    className="h-20 min-w-0 flex-1 bg-transparent text-[1.6rem]"
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer"
                  />
                </span>
                {isCorrect === "correct" || isCorrect === "wrong" ? (
                  <button
                    className="h-20 cursor-pointer rounded-lg bg-indigo-600 px-5 text-[1.35rem] font-semibold text-white hover:bg-indigo-700"
                    onClick={() => getExercise(exerciseType)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="h-20 cursor-pointer rounded-lg bg-indigo-600 px-5 text-[1.35rem] font-semibold text-white hover:bg-indigo-700"
                    onClick={() => handleAnswer(inputValue)}
                  >
                    Check
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full max-w-[54rem]">
                <button className="mb-3 text-[1.3rem] text-indigo-600" onClick={() => setWriting(true)}>
                  ✍
                </button>
                {exercise.options.map((answer) => (
                  <button
                    onClick={() => handleAnswer(answer)}
                    key={answer}
                    className="mb-2 block w-full rounded-lg border border-neutral-300 px-4 py-3 text-left text-[1.45rem] hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    {answer}
                  </button>
                ))}
              </div>
            )}

            <Letters
              inputValue={inputValue}
              exercise={exercise}
              inputRef={inputRef}
              setInputValue={setInputValue}
            />

            {/* Skip button */}
            <div>
              <button
                className="mt-8 cursor-pointer px-4 py-2 text-[1.3rem] text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                onClick={() => getExercise(exerciseType)}
              >
                Skip
              </button>
            </div>
          </>
        )}
      </div>
      {/* Exercise types */}
      <div className="flex justify-center">
        <div className="mt-4 flex justify-center gap-1 rounded-lg border border-neutral-200 p-1 dark:border-neutral-800">
          <button
            onClick={() => setExerciseType("translate")}
            className={` ${
              exerciseType === "translate" &&
              "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
            } cursor-pointer rounded-md px-4 py-2 text-[1.3rem] text-neutral-500 hover:text-neutral-950 dark:hover:text-white`}
          >
            Translate the Word
          </button>
          <button
            onClick={() => setExerciseType("fillblank")}
            className={`${
              exerciseType === "fillblank" &&
              "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
            } cursor-pointer rounded-md px-4 py-2 text-[1.3rem] text-neutral-500 hover:text-neutral-950 dark:hover:text-white`}
          >
            Fill the Blank
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
