export type RecordActivityInput = {
  path: string;
  label: string;
};

export type RecordStudyTimeInput = {
  minutes: number;
};

export type RecordExerciseAnswerInput = {
  learnedNewWord?: boolean;
};

export type CompleteDailyQuizInput = {
  correctAnswers: number;
  totalQuestions: number;
};
