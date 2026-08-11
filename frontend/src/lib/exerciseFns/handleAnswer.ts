import toast from "react-hot-toast";
import type { QueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import type { Progress, User, WordPair } from "../../types";
import type { AnswerStatus, ExercisePrompt } from "../../components/Exercise/types";

type LearnedWordPayload = {
  id: string;
  word: {
    learned: WordPair[];
  };
};

type AddLearnedWordFunction = (
  payload: LearnedWordPayload,
  options: { onSuccess: () => void },
) => Promise<Progress>;

type RecordCorrectAnswerFunction = (learnedNewWord: boolean) => Promise<User>;

export async function handleAnswer(
  recordCorrectAnswer: RecordCorrectAnswerFunction,
  answer: string,
  addLearnedWord: AddLearnedWordFunction,
  setExercise: Dispatch<SetStateAction<ExercisePrompt>>,
  selectedVerbs: WordPair[],
  progress: Progress[] | undefined,
  module: string,
  user: User | null,
  exercise: ExercisePrompt,
  setIsCorrect: Dispatch<SetStateAction<AnswerStatus>>,
  setSelectedVerbs: Dispatch<SetStateAction<WordPair[]>>,
  queryClient: QueryClient,
) {
  if (!user || !progress) return;

  const activeProgress = progress.find(
    (p) => p.moduleName === module && p.userName === user.email,
  );

  if (!activeProgress) {
    console.warn("Active progress not found");
    return;
  }

  if (answer === exercise.correctAnswer) {
    const learnedNewWord = !activeProgress.learned.flat().includes(answer);
    if (learnedNewWord) {
      addLearnedWord(
        {
          id: activeProgress._id,
          word: {
            learned: [...activeProgress.learned, [answer, exercise.question]],
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["progress"] });
          },
        },
      );
    }

    try {
      await recordCorrectAnswer(learnedNewWord);
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
    const filtered = activeProgress.learned.filter(
      (x) => x[0] !== exercise.correctAnswer,
    );
    addLearnedWord(
      {
        id: activeProgress._id,
        word: {
          learned: [...filtered],
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["progress"] });
        },
      },
    );
    toast.error("Wrong!");
  }
}
