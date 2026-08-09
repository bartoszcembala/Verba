export type LatestActivity = string[][];

export type StudyTimeEntry = {
  date: string;
  value: number;
};

export type Friend = {
  name: string;
  friendId: string;
  avatar: string;
};

export type QuizState = {
  date: string;
  finished: boolean;
};

export type WordPair = [string, string];

export type DailyQuestItem = {
  title: string;
  progress: number;
  toObtain: number;
  completed: boolean;
  icon: string;
};
