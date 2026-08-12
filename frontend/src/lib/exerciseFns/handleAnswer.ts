import toast from "react-hot-toast";
import type { QueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import type { User, WordPair } from "../../types";
import type { AnswerStatus, ExercisePrompt } from "../../components/Exercise/types";

type SubmitExerciseAnswerFunction = (input: {
  moduleName: string;
  word: string;
  answer: string;
}) => Promise<User>;

export async function handleAnswer(
  submitExerciseAnswer: SubmitExerciseAnswerFunction,
  answer: string,
  setExercise: Dispatch<SetStateAction<ExercisePrompt>>,
  selectedVerbs: WordPair[],
  module: string,
  user: User | null,
  exercise: ExercisePrompt,
  setIsCorrect: Dispatch<SetStateAction<AnswerStatus>>,
  setSelectedVerbs: Dispatch<SetStateAction<WordPair[]>>,
  queryClient: QueryClient,
) {
  if (!user) return;

  if (answer === exercise.correctAnswer) {
    try {
      await submitExerciseAnswer({
        moduleName: module,
        word: exercise.correctAnswer,
        answer,
      });
      await queryClient.invalidateQueries({ queryKey: ["progress"] });
    } catch {
      toast.error("Could not save your answer. Please try again.");
      return;
    }
    setSelectedVerbs((prev) => prev.filter((v) => v[0] !== answer));
    toast.success("Correct!");
    setIsCorrect("correct");
    if (selectedVerbs.length === 1) {
      setExercise({
        question: "",
        translation: "Tłumaczenie pytania",
        correctAnswer: "",
        options: ["opcja1", "opcja2", "opcja3", "opcja4"],
      });
      setIsCorrect("");
    }
  } else {
    setIsCorrect("wrong");
    toast.error("Wrong!");
  }
}
