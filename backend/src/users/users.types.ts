import type { Friend, LatestActivity, QuizState, StudyTimeEntry, UserRole, UserRow } from "../storage/schema";

export type UserWithRelationships = UserRow & {
  finishedLessons: string[];
  friends: Friend[];
};

export type PublicUser = {
  _id: string;
  __v: number;
  name: string;
  email: string;
  role: UserRole;
  latestActivity: LatestActivity;
  streak: string[];
  timeSpentLearning: StudyTimeEntry[];
  premium: boolean;
  exp: number;
  finishedLessons: string[];
  friends: Friend[];
  avatar: string;
  quiz: QuizState;
};

export type CreateUserInput = {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  latestActivity?: LatestActivity;
  streak?: string[];
  timeSpentLearning?: StudyTimeEntry[];
  premium?: boolean;
  exp?: number;
  avatar?: string;
  quiz?: QuizState;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "id" | "passwordHash" | "email">> & {
  email?: string;
  passwordHash?: string;
};

export const toPublicUser = (user: UserWithRelationships): PublicUser => ({
  _id: user.id,
  __v: 0,
  name: user.name,
  email: user.email,
  role: user.role,
  latestActivity: user.latestActivity,
  streak: user.streak,
  timeSpentLearning: user.timeSpentLearning,
  premium: user.premium,
  exp: user.exp,
  finishedLessons: user.finishedLessons,
  friends: user.friends,
  avatar: user.avatar,
  quiz: user.quiz,
});
