import { useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState, type KeyboardEvent } from "react";
import { useAddLearnedWord } from "../../lib/queries/progressQueries";
import { handleAnswer as handleAnswerImported } from "../../lib/exerciseFns/handleAnswer";
import {
  getExerciseFill,
  getExerciseTranslate,
} from "../../lib/exerciseFns/exercisesFn";
import { ExerciseContext } from "../../lib/contexts";
import Letters from "./Letters";
import {
  useIncrementDailyQuest,
} from "../../lib/queries/dailyQuestsQueries";
import { FiCheckSquare } from "react-icons/fi";
import { useEditUser } from "../../lib/queries/userQueries";
import type { AnswerStatus, ExercisePrompt } from "./types";

type ExerciseType = "translate" | "fillblank";

function Main() {
  const { selectedVerbs, setSelectedVerbs, verbs, progress, module, user } =
    useContext(ExerciseContext)!;
  const { editUser } = useEditUser();
  const { addLearnedWord } = useAddLearnedWord();
  const queryClient = useQueryClient();
  const [exercise, setExercise] = useState<ExercisePrompt>({
    question: "",
    translation: "Tłumaczenie pytania",
    correctAnswer: "",
    options: ["opcja1", "opcja2", "opcja3", "opcja4"],
  });
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<AnswerStatus>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>("translate");
  const [writing, setWriting] = useState(true);
  const { incrementDailyQuest } = useIncrementDailyQuest();

  function getExercise(type: ExerciseType) {
    if (type === "translate") {
      getExerciseTranslate(
        setInputValue,
        setIsCorrect,
        setExercise,
        verbs,
        selectedVerbs,
      );
    }

    if (type === "fillblank") {
      getExerciseFill(setInputValue, setIsCorrect, setExercise, selectedVerbs);
    }
  }

  function handleAnswer(input: string) {
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
      setSelectedVerbs,
      queryClient,
      incrementDailyQuest,
    );
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
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
    <section className="w-full overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <header className="flex flex-col gap-4 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-[1.55rem] font-semibold">Practice session</h1>
          <p className="mt-0.5 text-[1.2rem] text-neutral-500">{selectedVerbs.length} {selectedVerbs.length === 1 ? "word" : "words"} selected</p>
        </div>
        <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          <button
            onClick={() => setExerciseType("translate")}
            className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-[1.2rem] font-medium transition sm:flex-none ${exerciseType === "translate" ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            Translate
          </button>
          <button
            onClick={() => setExerciseType("fillblank")}
            className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-[1.2rem] font-medium transition sm:flex-none ${exerciseType === "fillblank" ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            Fill the blank
          </button>
        </div>
      </header>

      <div className="relative flex min-h-[50rem] flex-col items-center justify-center px-5 py-10 sm:px-10">
        {selectedVerbs.length === 0 ? (
          <div className="max-w-[42rem] text-center">
            <span className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-neutral-100 text-[2.4rem] dark:bg-neutral-800">Aa</span>
            <h2 className="text-[2.3rem] font-semibold">Choose words to practise</h2>
            <p className="mt-2 text-[1.35rem] leading-relaxed text-neutral-500">Select one or more words from the list to build your practice session.</p>
          </div>
        ) : exercise.correctAnswer === "" ? (
          <div className="max-w-[44rem] text-center">
            <p className="text-[1.25rem] font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Ready when you are</p>
            <h2 className="mt-2 text-[2.8rem] font-semibold tracking-tight">Practise {selectedVerbs.length} {selectedVerbs.length === 1 ? "word" : "words"}</h2>
            <p className="mt-3 text-[1.4rem] text-neutral-500">You can change the exercise type above at any time.</p>
            <button
              className="mt-7 cursor-pointer rounded-lg bg-indigo-600 px-7 py-3.5 text-[1.45rem] font-semibold text-white hover:bg-indigo-700"
              onClick={() =>
                exerciseType === "translate"
                  ? getExerciseTranslate(setInputValue, setIsCorrect, setExercise, verbs, selectedVerbs)
                  : getExerciseFill(setInputValue, setIsCorrect, setExercise, selectedVerbs)
              }
            >
              Start session
            </button>
          </div>
        ) : (
          <div className="flex w-full max-w-[64rem] flex-col items-center">
            <div className="mb-9 text-center">
              <p className="mb-2 text-[1.2rem] font-medium uppercase tracking-wide text-neutral-400">{exerciseType === "translate" ? "Translate this word" : "Complete the sentence"}</p>
              <h2 className="text-[3.4rem] font-semibold tracking-tight sm:text-[4rem]">
              {exercise.question}{" "}
              </h2>
            </div>

            {isCorrect && <div className={`mb-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[1.3rem] font-medium ${isCorrect === "correct" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300" : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300"}`}><span className={`h-3 w-3 rounded-full ${isCorrect === "correct" ? "bg-emerald-500" : "bg-red-500"}`} />{isCorrect === "correct" ? "Correct — nice work." : "Not quite. Check your answer and try again."}</div>}

            {writing ? (
              <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row">
                <span
                  className={`flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 transition focus-within:ring-2 focus-within:ring-indigo-100 dark:bg-neutral-950 dark:focus-within:ring-indigo-950 ${isCorrect === "correct" ? "border-emerald-500" : isCorrect === "wrong" ? "border-red-500" : "border-neutral-300 focus-within:border-indigo-500 dark:border-neutral-700"}`}
                >
                  <button
                    className="flex cursor-pointer items-center gap-2 text-[1.2rem] text-neutral-400 hover:text-indigo-600"
                    onClick={() => setWriting(false)}
                    aria-label="Switch to multiple choice"
                  >
                    <FiCheckSquare className="h-7 w-7" />
                  </button>
                  <input
                    className="h-20 min-w-0 flex-1 bg-transparent text-[1.55rem]"
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
                    className="h-20 cursor-pointer rounded-lg bg-indigo-600 px-7 text-[1.35rem] font-semibold text-white hover:bg-indigo-700"
                    onClick={() => getExercise(exerciseType)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="h-20 cursor-pointer rounded-lg bg-indigo-600 px-7 text-[1.35rem] font-semibold text-white hover:bg-indigo-700"
                    onClick={() => handleAnswer(inputValue)}
                  >
                    Check
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full">
                <button className="mb-4 text-[1.25rem] font-medium text-indigo-600 hover:underline dark:text-indigo-400" onClick={() => setWriting(true)}>
                  Switch to typing
                </button>
                <div className="grid gap-3 sm:grid-cols-2">{exercise.options.map((answer, index) => (
                  <button
                    onClick={() => handleAnswer(answer)}
                    key={answer}
                    className="flex min-h-20 w-full items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 text-left text-[1.4rem] font-medium hover:border-indigo-400 hover:bg-indigo-50/60 dark:border-neutral-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                  >
                    <span>{answer}</span><span className="text-[1.1rem] text-neutral-400">{String.fromCharCode(65 + index)}</span>
                  </button>
                ))}</div>
              </div>
            )}

            <Letters
              inputValue={inputValue}
              exercise={exercise}
              inputRef={inputRef}
              setInputValue={setInputValue}
            />

            <button className="mt-7 cursor-pointer px-4 py-2 text-[1.25rem] font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white" onClick={() => getExercise(exerciseType)}>Skip this word</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Main;
