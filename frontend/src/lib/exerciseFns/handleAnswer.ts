import toast from "react-hot-toast";
import type { QueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import type { DailyQuestsInterface, Progress, User, WordPair } from "../../types";
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

type EditUserFunction = (input: { data: Partial<User> }) => Promise<User>;

export async function handleAnswer(
  editUser: EditUserFunction,
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
  incrementDailyQuest: (payload: {
    index: number;
    userId: string;
  }) => Promise<DailyQuestsInterface>,
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
    if (!activeProgress.learned.flat().includes(answer)) {
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

      //Daily Quest logic

      incrementDailyQuest({ index: 1, userId: user._id });
    }

    setSelectedVerbs((prev) => prev.filter((v) => v[0] !== answer));
    toast.success("Correct!");
    setIsCorrect("correct");
    editUser({
      data: { exp: user.exp + 10 * (user.streak.length / 100 + 1) },
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        exp: user.exp + 10 * (user.streak.length / 100 + 1),
      }),
    );
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
