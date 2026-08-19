import { useEffect, useRef, type KeyboardEvent } from "react";
import { FiCheckSquare } from "react-icons/fi";
import Spinner from "../Spinner";
import Letters from "./Letters";
import type { ExerciseSession } from "./useExerciseSession";

function Main({ session }: { session: ExerciseSession }) {
  const { state, nextQuestion } = session;
  const inputRef = useRef<HTMLInputElement>(null);
  const prompt = state.prompt;
  const hasFeedback = state.phase === "feedback";
  const isBusy = state.phase === "loading";

  useEffect(() => {
    if (state.phase !== "feedback" || state.feedback !== "correct") return;

    function handleFeedbackEnter(event: globalThis.KeyboardEvent) {
      if (event.key !== "Enter" || event.repeat) return;
      event.preventDefault();
      void nextQuestion();
    }

    window.addEventListener("keydown", handleFeedbackEnter);
    return () => window.removeEventListener("keydown", handleFeedbackEnter);
  }, [nextQuestion, state.feedback, state.phase]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (state.phase === "answering") void session.submitAnswer(state.input);
  }

  return (
    <section className="w-full overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <header className="flex flex-col gap-4 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-[1.55rem] font-semibold">Practice session</h1>
          <p className="mt-0.5 text-[1.2rem] text-neutral-500">
            {state.selectedWords.length} {state.selectedWords.length === 1 ? "word" : "words"} selected
          </p>
        </div>
        <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          <button
            type="button"
            onClick={() => session.setExerciseType("translate")}
            className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-[1.2rem] font-medium transition sm:flex-none ${state.exerciseType === "translate" ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            Translate
          </button>
          <button
            type="button"
            onClick={() => session.setExerciseType("fillblank")}
            className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-[1.2rem] font-medium transition sm:flex-none ${state.exerciseType === "fillblank" ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            Fill the blank
          </button>
        </div>
      </header>

      <div className="relative flex min-h-[50rem] flex-col items-center justify-center px-5 py-10 sm:px-10">
        {state.phase === "selecting" ? (
          <div className="max-w-[42rem] text-center">
            <span className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-neutral-100 text-[2.4rem] dark:bg-neutral-800">Aa</span>
            <h2 className="text-[2.3rem] font-semibold">Choose words to practise</h2>
            <p className="mt-2 text-[1.35rem] leading-relaxed text-neutral-500">Select one or more words from the list to build your practice session.</p>
          </div>
        ) : state.phase === "ready" ? (
          <div className="max-w-[44rem] text-center">
            <p className="text-[1.25rem] font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Ready when you are</p>
            <h2 className="mt-2 text-[2.8rem] font-semibold tracking-tight">Practise {state.selectedWords.length} {state.selectedWords.length === 1 ? "word" : "words"}</h2>
            <p className="mt-3 text-[1.4rem] text-neutral-500">You can change the exercise type above at any time.</p>
            <button type="button" className="mt-7 cursor-pointer rounded-lg bg-indigo-600 px-7 py-3.5 text-[1.45rem] font-semibold text-white hover:bg-indigo-700" onClick={() => void session.nextQuestion()}>
              Start session
            </button>
          </div>
        ) : state.phase === "loading" ? (
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-[1.35rem] text-neutral-500">Preparing your next question…</p>
          </div>
        ) : state.phase === "complete" ? (
          <div className="max-w-[42rem] text-center">
            <span className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-[2.4rem] text-emerald-700 dark:bg-emerald-950/40">✓</span>
            <h2 className="text-[2.3rem] font-semibold">Session complete</h2>
            <p className="mt-2 text-[1.35rem] text-neutral-500">You completed every selected word.</p>
            <button type="button" className="mt-7 cursor-pointer rounded-lg border border-neutral-300 px-6 py-3 text-[1.35rem] font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={session.recover}>
              Choose more words
            </button>
          </div>
        ) : state.phase === "error" ? (
          <div className="max-w-[42rem] text-center">
            <h2 className="text-[2.2rem] font-semibold">Something went wrong</h2>
            <p className="mt-2 text-[1.35rem] text-neutral-500">{state.error}</p>
            <button type="button" className="mt-6 cursor-pointer rounded-lg bg-indigo-600 px-6 py-3 text-[1.35rem] font-semibold text-white hover:bg-indigo-700" onClick={session.recover}>
              Try again
            </button>
          </div>
        ) : prompt ? (
          <div className="flex w-full max-w-[64rem] flex-col items-center">
            <div className="mb-9 text-center">
              <p className="mb-2 text-[1.2rem] font-medium uppercase tracking-wide text-neutral-400">{state.exerciseType === "translate" ? "Translate this word" : "Complete the sentence"}</p>
              <h2 className="text-[3.4rem] font-semibold tracking-tight sm:text-[4rem]">{prompt.question}</h2>
            </div>

            {state.feedback && (
              <div className={`mb-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[1.3rem] font-medium ${state.feedback === "correct" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300" : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300"}`}>
                <span className={`h-3 w-3 rounded-full ${state.feedback === "correct" ? "bg-emerald-500" : "bg-red-500"}`} />
                {state.feedback === "correct" ? "Correct — nice work." : "Not quite. Check your answer and try again."}
              </div>
            )}

            {state.answerMode === "writing" ? (
              <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row">
                <span className={`flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 transition focus-within:ring-2 focus-within:ring-indigo-100 dark:bg-neutral-950 dark:focus-within:ring-indigo-950 ${state.feedback === "correct" ? "border-emerald-500" : state.feedback === "wrong" ? "border-red-500" : "border-neutral-300 focus-within:border-indigo-500 dark:border-neutral-700"}`}>
                  <button type="button" className="flex cursor-pointer items-center gap-2 text-[1.2rem] text-neutral-400 hover:text-indigo-600" onClick={() => session.setAnswerMode("choices")} aria-label="Switch to multiple choice">
                    <FiCheckSquare className="h-7 w-7" />
                  </button>
                  <input
                    className="h-20 min-w-0 flex-1 bg-transparent text-[1.55rem]"
                    type="text"
                    ref={inputRef}
                    value={state.input}
                    disabled={isBusy || state.feedback === "correct"}
                    onChange={(event) => session.setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer"
                  />
                </span>
                {hasFeedback ? (
                  <button type="button" className="h-20 cursor-pointer rounded-lg bg-indigo-600 px-7 text-[1.35rem] font-semibold text-white hover:bg-indigo-700" onClick={() => void session.nextQuestion()}>
                    Next
                  </button>
                ) : (
                  <button type="button" disabled={isBusy || !state.input.trim()} className="h-20 cursor-pointer rounded-lg bg-indigo-600 px-7 text-[1.35rem] font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" onClick={() => void session.submitAnswer(state.input)}>
                    Check
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full">
                <button type="button" className="mb-4 text-[1.25rem] font-medium text-indigo-600 hover:underline dark:text-indigo-400" onClick={() => session.setAnswerMode("writing")}>Switch to typing</button>
                <div className="grid gap-3 sm:grid-cols-2">
                  {prompt.options.map((answer, index) => (
                    <button type="button" disabled={isBusy || hasFeedback} onClick={() => void session.submitAnswer(answer)} key={`${answer}-${index}`} className="flex min-h-20 w-full items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 text-left text-[1.4rem] font-medium hover:border-indigo-400 hover:bg-indigo-50/60 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20">
                      <span>{answer}</span><span className="text-[1.1rem] text-neutral-400">{String.fromCharCode(65 + index)}</span>
                    </button>
                  ))}
                </div>
                {hasFeedback && <button type="button" className="mt-4 w-full cursor-pointer rounded-lg bg-indigo-600 py-3 text-[1.35rem] font-semibold text-white hover:bg-indigo-700" onClick={() => void session.nextQuestion()}>Next</button>}
              </div>
            )}

            <Letters onAppend={session.appendCharacter} onHint={session.useHint} inputRef={inputRef} />
            <button type="button" disabled={isBusy} className="mt-7 cursor-pointer px-4 py-2 text-[1.25rem] font-medium text-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white" onClick={() => void session.nextQuestion()}>Skip this word</button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Main;
