type timeSpentLearningType = {
  date: string;
  value: number;
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
  __v: number;
}

export interface Progress {
  _id: string;
  userName: string;
  moduleName: string;
  learned: string[];
  __v: number;
}
