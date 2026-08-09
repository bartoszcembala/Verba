import type { Dispatch, SetStateAction } from "react";

export type WordPair = [string, string];

export type ExercisePrompt = {
  question: string;
  translation: string;
  correctAnswer: string;
  options: string[];
};

export type AnswerStatus = "correct" | "wrong" | "";

export type AnswerStat = {
  name: "correct" | "wrong";
  value: number;
  color: string;
};

export type SetCorrect = Dispatch<SetStateAction<AnswerStat[]>>;
