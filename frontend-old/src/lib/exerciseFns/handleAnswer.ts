import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import { DailyQuestsInterface } from "../../types";
import axios from "axios";
import { useEditUser } from "../queries/userQueries";

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//MIGRACJA NA TS NIE SPRAWDZONA: DO SPRAWDZENIA

type Exercise = {
  correctAnswer: string;
  translation: string;
  question: string;
};

type ProgressItem = {
  moduleName: string;
  userName: string;
  _id: string;
  learned: string[][];
};

type LearnedWordPayload = {
  id: string;
  word: {
    learned: string[][];
  };
};

type AddLearnedWordFunction = (
  payload: LearnedWordPayload,
  options: { onSuccess: () => void },
) => void;

type SetState<T> = (value: T | ((prev: T) => T)) => void;

export async function handleAnswer(
  editUser,
  answer: string,
  addLearnedWord: AddLearnedWordFunction,
  setExercise,
  selectedVerbs,
  progress: ProgressItem[],
  module: string,
  user,
  exercise: Exercise,
  setIsCorrect: SetState<"correct" | "wrong" | "">,
  setCorrect: SetState<[{ value: string[] }, { value: [string, string][] }]>,
  setSelectedVerbs: SetState<[string, string][]>,
  queryClient: QueryClient,
  dailyQuests: DailyQuestsInterface[],
  editDailyQuests: any,
  incrementDailyQuest: (payload: {
    index: number;
    userId: string;
  }) => Promise<any>,
) {

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
      id: user._id,
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
