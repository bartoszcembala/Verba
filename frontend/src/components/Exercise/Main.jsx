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
import { FiCheckSquare } from "react-icons/fi";
import { useEditUser, useUser } from "../../lib/queries/userQueries";

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
      editDailyQuests
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
    <div className="overflow-hidden w-[90%] h-[44rem] lg:h-[85vh] ">
      <div
        className={` relative flex  flex-col items-center rounded-2xl lg:py-24 py-19  px-10 h-[38rem] lg:h-[60rem] transition-colors duration-300 ease-in-out border-1 border-indigo-500 shadow-[inset_0_0_100px_rgba(99,102,241,0.3)] `}
      >
        {selectedVerbs.length === 0 ? (
          <p className="text-6xl mt-30 font-extrabold">
            Add at least 1 word to start
          </p>
        ) : exercise.correctAnswer === "" ? (
          <button
            className="cursor-pointer font-bold px-8 py-4 rounded-3xl shadow-[inset_0_0_100px_rgba(99,102,241,0.3)] bg-gradient-to-br from-indigo-500 to-indigo-900 text-7xl mt-30 overflow-hidden transition hover:scale-105 uppercase group  relative z-10"
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
            <span>Start</span>
            <span
              className="absolute top-28 left-73 w-[250%] h-[250%]
               bg-gradient-to-br from-white/0 via-white/40 to-white/0
               -translate-x-full -translate-y-full
               transition-transform duration-700 ease-out
               group-hover:-translate-x-74 group-hover:-translate-y-29"
            ></span>
          </button>
        ) : (
          <>
            <h2 className="text-6xl font-extrabold lg:mb-22 mb-20 lg:mt-26">
              {exercise.question}{" "}
              {/* <span onClick={() => setShowTranslation(!showTranslation)}>
                TRANSLATE
              </span> */}
            </h2>
            <p className="translation">
              {showTranslation && exercise.correctAnswer}
            </p>
            {writing ? (
              <div className="text-5xl flex item-center justify-center">
                <span
                  className={`w-[70%]  bg-neutral-200  border-1 border-neutral-300 dark:border-none rounded-xl px-5 py-3 mx-3 flex gap-6 
                    ${isCorrect === "correct" && "dark:bg-[#323a34]"} 
                    ${isCorrect === "wrong" && "dark:bg-[#3a3232]"} 
                    bg-neutral-700`}
                >
                  <button
                    className="cursor-pointer w-[10%]"
                    onClick={() => setWriting(false)}
                  >
                    <FiCheckSquare />
                  </button>
                  <input
                    className=""
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
                    className="cursor-pointer  bg-indigo-500 rounded-2xl px-4 py-1 text-3xl shadow-[0_0_20px_rgba(34,0,120,0.9)] hover:scale-102 hover:bg-indigo-600 transition border-indigo-700 border-1 w-40 "
                    onClick={() => getExercise(exerciseType)}
                  >
                    NEXT ➡
                  </button>
                ) : (
                  <button
                    className="cursor-pointer  bg-indigo-500 rounded-2xl w-40 px-4 py-1 text-3xl shadow-[0_0_20px_rgba(34,0,120,0.9)] hover:scale-102 hover:bg-indigo-600 transition border-indigo-700 border-1"
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

            {/* Skip button */}
            <div className="buttons">
              <button
                className=" cursor-pointer   transition px-4 py-2 rounded-2xl mt-40 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-104 [0_0_20px_rgba(34,0,120,0.9)] border-indigo-700 border-2"
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
        <div className="mt-10 dark:bg-neutral-800 bg-neutral-300 rounded-full px-2 gap-3 py-2  flex justify-center ">
          <button
            onClick={() => setExerciseType("translate")}
            className={` ${
              exerciseType === "translate" &&
              "[0_0_20px_rgba(34,0,120,0.9)] border-indigo-600 border-1 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-indigo-600 bg-gradient-to-r from-indigo-400 to-indigo-500"
            } cursor-pointer   transition-colors  px-4 py-2 rounded-full  hover:bg-neutral-200 dark:hover:bg-neutral-600 `}
          >
            Translate the Word
          </button>
          <button
            onClick={() => setExerciseType("fillblank")}
            className={`${
              exerciseType === "fillblank" &&
              "[0_0_20px_rgba(34,0,120,0.9)] border-1 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-indigo-600 bg-gradient-to-l from-indigo-400 to-indigo-500"
            } cursor-pointer   transition-colors px-4 py-2 rounded-full   hover:bg-neutral-200 dark:hover:bg-neutral-600`}
          >
            Fill the Blank
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;
