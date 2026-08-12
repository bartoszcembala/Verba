import { useCallback, useMemo, useReducer } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { Progress, User, WordPair } from "../../types";
import { fetchExercise } from "../../lib/fetchExercises";
import { useProgression } from "../../lib/queries/progressionQueries";
import { shuffleArray } from "../../lib/shuffle";
import type { AnswerStatus, ExercisePrompt } from "./types";

export type ExerciseType = "translate" | "fillblank";
export type AnswerMode = "writing" | "choices";
export type ExercisePhase =
  | "selecting"
  | "ready"
  | "loading"
  | "answering"
  | "submitting"
  | "feedback"
  | "complete"
  | "error";

type State = {
  phase: ExercisePhase;
  selectedWords: WordPair[];
  exerciseType: ExerciseType;
  answerMode: AnswerMode;
  prompt: ExercisePrompt | null;
  input: string;
  feedback: AnswerStatus;
  error: string | null;
};

type Action =
  | { type: "SET_SELECTION"; words: WordPair[] }
  | { type: "SET_EXERCISE_TYPE"; exerciseType: ExerciseType }
  | { type: "SET_ANSWER_MODE"; answerMode: AnswerMode }
  | { type: "SET_INPUT"; input: string }
  | { type: "LOAD_PROMPT" }
  | { type: "PROMPT_READY"; prompt: ExercisePrompt }
  | { type: "PROMPT_FAILED"; message: string }
  | { type: "SUBMIT" }
  | { type: "WRONG" }
  | { type: "CORRECT"; word: string }
  | { type: "RESET_ERROR" };

const initialState: State = {
  phase: "selecting",
  selectedWords: [],
  exerciseType: "translate",
  answerMode: "writing",
  prompt: null,
  input: "",
  feedback: "",
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SELECTION": {
      if (state.phase === "loading" || state.phase === "submitting") return state;
      const noWords = action.words.length === 0;
      const shouldReturnToReady = !state.prompt || ["selecting", "complete", "error"].includes(state.phase);
      return {
        ...state,
        selectedWords: action.words,
        phase: noWords ? "selecting" : shouldReturnToReady ? "ready" : state.phase,
        ...(noWords ? { prompt: null, input: "", feedback: "" as AnswerStatus } : {}),
      };
    }
    case "SET_EXERCISE_TYPE":
      if (state.phase === "loading" || state.phase === "submitting") return state;
      return {
        ...state,
        exerciseType: action.exerciseType,
        prompt: null,
        input: "",
        feedback: "",
        error: null,
        phase: state.selectedWords.length ? "ready" : "selecting",
      };
    case "SET_ANSWER_MODE":
      return { ...state, answerMode: action.answerMode };
    case "SET_INPUT":
      return { ...state, input: action.input };
    case "LOAD_PROMPT":
      return { ...state, phase: "loading", prompt: null, input: "", feedback: "", error: null };
    case "PROMPT_READY":
      return { ...state, phase: "answering", prompt: action.prompt, input: "", feedback: "", error: null };
    case "PROMPT_FAILED":
      return { ...state, phase: "error", prompt: null, error: action.message };
    case "SUBMIT":
      return { ...state, phase: "submitting", feedback: "", error: null };
    case "WRONG":
      return { ...state, phase: "feedback", feedback: "wrong" };
    case "CORRECT": {
      const selectedWords = state.selectedWords.filter(([word]) => word !== action.word);
      return {
        ...state,
        selectedWords,
        phase: selectedWords.length ? "feedback" : "complete",
        feedback: "correct",
      };
    }
    case "RESET_ERROR":
      return { ...state, phase: state.selectedWords.length ? "ready" : "selecting", error: null };
  }
}

function createTranslationPrompt(verbs: WordPair[], selectedWords: WordPair[]): ExercisePrompt {
  const picked = selectedWords[Math.floor(Math.random() * selectedWords.length)];
  const alternatives = shuffleArray(
    [...new Set(verbs.map(([word]) => word).filter((word) => word !== picked[0]))],
  ).slice(0, 3);
  return {
    question: picked[1],
    translation: picked[0],
    correctAnswer: picked[0],
    options: shuffleArray([picked[0], ...alternatives]),
  };
}

type UseExerciseSessionInput = {
  verbs: WordPair[];
  moduleName: string;
  user: User | null;
  activeProgress?: Progress;
};

export function useExerciseSession({
  verbs,
  moduleName,
  user,
  activeProgress,
}: UseExerciseSessionInput) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const { submitExerciseAnswer, resetExerciseProgress } = useProgression();

  const setSelection = useCallback((words: WordPair[]) => {
    dispatch({ type: "SET_SELECTION", words });
  }, []);

  const toggleWord = useCallback((word: WordPair) => {
    const selected = state.selectedWords.some(([candidate]) => candidate === word[0]);
    setSelection(selected
      ? state.selectedWords.filter(([candidate]) => candidate !== word[0])
      : [...state.selectedWords, word]);
  }, [setSelection, state.selectedWords]);

  const selectAll = useCallback(() => setSelection(verbs), [setSelection, verbs]);
  const selectUnlearned = useCallback(() => {
    const learned = new Set(activeProgress?.learned.map(([word]) => word) ?? []);
    setSelection(verbs.filter(([word]) => !learned.has(word)));
  }, [activeProgress?.learned, setSelection, verbs]);

  const nextQuestion = useCallback(async () => {
    if (state.selectedWords.length === 0 || state.phase === "loading" || state.phase === "submitting") return;
    dispatch({ type: "LOAD_PROMPT" });
    try {
      const prompt = state.exerciseType === "translate"
        ? createTranslationPrompt(verbs, state.selectedWords)
        : await fetchExercise(
          state.selectedWords[Math.floor(Math.random() * state.selectedWords.length)],
        );
      dispatch({ type: "PROMPT_READY", prompt });
    } catch {
      dispatch({ type: "PROMPT_FAILED", message: "Exercise could not be generated." });
      toast.error("Exercise could not be generated.");
    }
  }, [state.exerciseType, state.phase, state.selectedWords, verbs]);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!state.prompt || !user || state.phase === "submitting") return;
    if (answer !== state.prompt.correctAnswer) {
      dispatch({ type: "WRONG" });
      toast.error("Wrong!");
      return;
    }

    dispatch({ type: "SUBMIT" });
    try {
      await submitExerciseAnswer({
        moduleName,
        word: state.prompt.correctAnswer,
        answer,
      });
      await queryClient.invalidateQueries({ queryKey: ["progress"] });
      dispatch({ type: "CORRECT", word: state.prompt.correctAnswer });
      toast.success("Correct!");
    } catch {
      dispatch({ type: "PROMPT_FAILED", message: "Could not save your answer. Please try again." });
      toast.error("Could not save your answer. Please try again.");
    }
  }, [moduleName, queryClient, state.phase, state.prompt, submitExerciseAnswer, user]);

  const resetProgress = useCallback(async () => {
    await resetExerciseProgress(moduleName);
    await queryClient.invalidateQueries({ queryKey: ["progress"] });
  }, [moduleName, queryClient, resetExerciseProgress]);

  const appendCharacter = useCallback((character: string) => {
    dispatch({ type: "SET_INPUT", input: state.input + character });
  }, [state.input]);

  const useHint = useCallback(() => {
    if (!state.prompt) return;
    const current = state.input;
    const correct = state.prompt.correctAnswer;
    const wrongIndex = [...current].findIndex((character, index) => character !== correct[index]);
    const input = wrongIndex >= 0
      ? current.slice(0, wrongIndex) + (correct[wrongIndex] ?? "")
      : current + correct.slice(current.length, current.length + 1);
    dispatch({ type: "SET_INPUT", input });
  }, [state.input, state.prompt]);

  const stats = useMemo(() => {
    const learned = activeProgress?.learned.length ?? 0;
    return [
      { name: "correct" as const, value: learned, color: "#34563c" },
      { name: "wrong" as const, value: Math.max(0, verbs.length - learned), color: "#563434" },
    ];
  }, [activeProgress?.learned.length, verbs.length]);

  return {
    state,
    stats,
    setExerciseType: (exerciseType: ExerciseType) => dispatch({ type: "SET_EXERCISE_TYPE", exerciseType }),
    setAnswerMode: (answerMode: AnswerMode) => dispatch({ type: "SET_ANSWER_MODE", answerMode }),
    setInput: (input: string) => dispatch({ type: "SET_INPUT", input }),
    toggleWord,
    selectAll,
    selectUnlearned,
    nextQuestion,
    submitAnswer,
    resetProgress,
    appendCharacter,
    useHint,
    recover: () => dispatch({ type: "RESET_ERROR" }),
  };
}

export type ExerciseSession = ReturnType<typeof useExerciseSession>;
