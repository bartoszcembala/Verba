import type { DailyQuestKey } from "../storage/schema";

export type DailyQuestItem = {
  key: DailyQuestKey;
  title: string;
  progress: number;
  toObtain: number;
  completed: boolean;
  icon: string;
};

export type DailyQuestResponse = {
  _id: string;
  __v: number;
  userId: string;
  day: string;
  quests: DailyQuestItem[];
};

export type DailyQuestDefinition = {
  key: DailyQuestKey;
  title: string;
  toObtain: number;
  icon: string;
};

export const DEFAULT_QUESTS: DailyQuestDefinition[] = [
  { key: "study_time", title: "spend 10 minutes learning", toObtain: 10, icon: "clock" },
  { key: "learn_words", title: "learn 5 new words", toObtain: 5, icon: "bulb" },
  { key: "daily_quiz", title: "finish Daily Quiz", toObtain: 1, icon: "flag" },
  { key: "complete_lesson", title: "finish lesson", toObtain: 1, icon: "flag" },
];
