export type GenerateExerciseInput = {
  word: string;
  translation: string;
};

export type GeneratedExercise = {
  question: string;
  translation: string;
  correctAnswer: string;
  options: string[];
};
