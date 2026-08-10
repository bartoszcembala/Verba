import { createContext, type Dispatch, type SetStateAction } from "react";
import { Progress, User, type WordPair } from "../types";

export type SettingsContextType = {
  mode: "guest" | "user";
  setMode: (v: "guest" | "user") => void;
  authorized: boolean;
  setAuthorized: (v: boolean) => void;
  authLoading: boolean;
  id: string | null;
  setId: (v: string | null) => void;
};

export type ExerciseContextType = {
  verbs: WordPair[];
  selectedVerbs: WordPair[];
  setSelectedVerbs: Dispatch<SetStateAction<WordPair[]>>;
  progress: Progress[] | undefined;
  user: User | null;
  module: string;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);
export const ExerciseContext = createContext<ExerciseContextType | undefined>(
  undefined
);
