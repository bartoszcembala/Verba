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

export interface LessonInterface {
  _id: string;
  title: string;
  html: string;
  relatedExercises: string[];
  type: string;
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
  quests: dailyQuestType[];
}
