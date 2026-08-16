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
};
