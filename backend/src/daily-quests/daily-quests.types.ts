import type { DailyQuestItem } from "../storage/schema";

export type DailyQuestResponse = {
  _id: string;
  __v: number;
  userId: string;
  day: string;
  quests: DailyQuestItem[];
};

export type CreateDailyQuestInput = {
  id?: string;
  userId: string;
  day: string;
  quests: DailyQuestItem[];
};

export const DEFAULT_QUESTS: DailyQuestItem[] = [
  { title: "spend 10 minutes learning", progress: 0, toObtain: 10, completed: false, icon: "clock" },
  { title: "learn 5 new words", progress: 0, toObtain: 5, completed: false, icon: "bulb" },
  { title: "finish Daily Quiz", progress: 0, toObtain: 1, completed: false, icon: "flag" },
  { title: "finish lesson", progress: 0, toObtain: 1, completed: false, icon: "flag" },
];
