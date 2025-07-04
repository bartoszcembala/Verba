type timeSpentLearningType = {
  date: string;
  value: number;
};

type friendsType = {
  name: string;
  friendId: string;
  avatar: string;
};

type quizType = {
  finished: boolean;
  date: string;
};

export interface User {
  _id: string;
  __v: number;
  name: string;
  email: string;
  password: string;
  latestActivity: string[];
  streak: string[];
  timeSpentLearning: timeSpentLearningType[];
  premium: boolean;
  exp: number;
  finishedLessons: string[];
  friends: friendsType[];
  avatar: string;
  quiz: quizType;
}

export interface Lesson {
  _id: string;
  title: string;
  html: string;
  relatedExercises: string[];
  __v: number;
}

export interface Module {
  _id: string;
  title: string;
  displayName: string;
  words: string[][];
  level: string;
  __v: number;
}

export interface Progress {
  _id: string;
  userName: string;
  moduleName: string;
  learned: string[][];
  __v: number;
}

export type dailyQuestType = {
  title: string;
  progress: number;
  toObtain: number;
  completed: boolean;
  icon: string;
};
export interface DailyQuestsInterface {
  _id: string;
  __v: number;
  userId: string;
  day: string;
  quest1: dailyQuestType;
  quest2: dailyQuestType;
  quest3: dailyQuestType;
  quest4: dailyQuestType;
}
