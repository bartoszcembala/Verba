import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//MIGRACJA NA TS NIE SPRAWDZONA: DO SPRAWDZENIA

type Exercise = {
  correctAnswer: string;
  translation: string;
};

type Account = {
  modulesPercent: Record<string, string[]>;
  notLearned: Record<string, [string, string][]>;
  // inne pola konta
};

type ProgressItem = {
  moduleName: string;
  userName: string;
  _id: string;
  learned: string[];
};

type LearnedWordPayload = {
  id: string;
  word: {
    learned: string[];
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
  account: Account,
  setAccount: SetState<Account>,
  setCorrect: SetState<[{ value: string[] }, { value: [string, string][] }]>,
  setSelectedVerbs: SetState<[string, string][]>,
  queryClient: QueryClient
) {
  if (mode === "guest") {
    let newAccount: Account;

    if (answer === exercise.correctAnswer) {
      toast.success("Brawo! Poprawna odpowiedź.");
      setIsCorrect("correct");

      newAccount = {
        ...account,
        modulesPercent: {
          ...account.modulesPercent,
          [module]: account.modulesPercent[module].includes(answer)
            ? [...account.modulesPercent[module]]
            : [...account.modulesPercent[module], answer],
        },
        notLearned: {
          ...account.notLearned,
          [module]: account.notLearned[module].filter((v) => v[0] !== answer),
        },
      };

      setAccount(newAccount);
      setCorrect((prev) => [
        {
          ...prev[0],
          value: prev[0].value.includes(answer)
            ? [...prev[0].value]
            : [...prev[0].value, answer],
        },
        { ...prev[1], value: prev[1].value.filter((v) => v[0] !== answer) },
      ]);
      setSelectedVerbs((prev) => prev.filter((v) => v[0] !== answer));
    } else {
      toast.error("Niestety, to nie jest poprawna odpowiedź.");
      setIsCorrect("wrong");

      const notLearnedExists = account.notLearned[module].some(
        ([word]) => word === exercise.correctAnswer
      );

      const updatedNotLearned: [string, string][] = notLearnedExists
        ? [...account.notLearned[module]]
        : [
            ...account.notLearned[module],
            [exercise.correctAnswer, exercise.translation],
          ];

      newAccount = {
        ...account,
        modulesPercent: {
          ...account.modulesPercent,
          [module]: account.modulesPercent[module].filter(
            (v) => v !== exercise.correctAnswer
          ),
        },
        notLearned: {
          ...account.notLearned,
          [module]: updatedNotLearned,
        },
      };

      setAccount(newAccount);
      setCorrect((prev) => [
        {
          ...prev[0],
          value: prev[0].value.filter((v) => v !== exercise.correctAnswer),
        },
        {
          ...prev[1],
          value: prev[1].value.some(([word]) => word === exercise.correctAnswer)
            ? [...prev[1].value]
            : [
                ...prev[1].value,
                [exercise.correctAnswer, exercise.translation],
              ],
        },
      ]);
    }

    localStorage.setItem("account", JSON.stringify(newAccount));
  } else if (mode === "user") {
    const activeProgress = progress.find(
      (p) => p.moduleName === module && p.userName === user.email
    );

    if (!activeProgress) {
      // Obsłuż przypadek, gdy progress nie został znaleziony
      console.warn("Active progress not found");
      return;
    }

    if (answer === exercise.correctAnswer) {
      if (!activeProgress.learned.includes(answer)) {
        addLearnedWord(
          {
            id: activeProgress._id,
            word: {
              learned: [...activeProgress.learned, answer],
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["progress"] });
              toast.success("Progress updated!");
            },
          }
        );
      }

      toast.success("Brawo! Poprawna odpowiedź!");
      setIsCorrect("correct");
    } else {
      setIsCorrect("wrong");
      const filtered = activeProgress.learned.filter(
        (x) => x !== exercise.correctAnswer
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
            toast.error("Progress updated!");
          },
        }
      );
      toast.error("Źle");
    }
  }
}
