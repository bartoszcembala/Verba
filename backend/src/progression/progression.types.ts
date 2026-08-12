export type RecordActivityInput = {
  path: string;
  label: string;
};

export type RecordStudyTimeInput = {
  minutes: number;
};

export type RecordExerciseAnswerInput = {
  moduleName: string;
  word: string;
  answer: string;
};

export type DailyQuizAnswerInput = {
  word: string;
  answer: string;
};

export type CompleteDailyQuizInput = {
  answers: DailyQuizAnswerInput[];
};
