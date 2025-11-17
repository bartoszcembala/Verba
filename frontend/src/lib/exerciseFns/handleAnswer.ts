import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import { DailyQuestsInterface } from "../../types";
import axios from "axios";

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
  options: { onSuccess: () => void }
) => void;

type SetState<T> = (value: T | ((prev: T) => T)) => void;

export async function handleAnswer(
  answer: string,
  addLearnedWord: AddLearnedWordFunction,
  mode: "guest" | "user",
  progress: ProgressItem[],
  module: string,
  user: { email: string },
  exercise: Exercise,
  setIsCorrect: SetState<"correct" | "wrong" | "">,
  setCorrect: SetState<[{ value: string[] }, { value: [string, string][] }]>,
  setSelectedVerbs: SetState<[string, string][]>,
  queryClient: QueryClient,
  dailyQuests: DailyQuestsInterface[],
  editDailyQuests: any,
  handleUpdateDailyQuest: any
) {
  const activeProgress = progress.find(
    (p) => p.moduleName === module && p.userName === user.email
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
        }
      );

      //Daily Quest logic
      async function handleAnswerC(index: number) {
        try {
          const res = await axios.patch(
            "http://localhost:5000/api/daily-quests/increment",
            { index },
            { withCredentials: true }
          );
          console.log(res.data);
        } catch (error) {
          console.error(error);
        }
      }
      handleAnswerC(1);
    }

    setSelectedVerbs((prev) => prev.filter((v) => v[0] !== answer));
    toast.success("Brawo! Poprawna odpowiedź!");
    setIsCorrect("correct");
  } else {
    setIsCorrect("wrong");
    const filtered = activeProgress.learned.filter(
      (x) => x[0] !== exercise.correctAnswer
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
      }
    );
    toast.error("Źle");
  }
}
