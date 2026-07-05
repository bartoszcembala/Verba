import { createContext } from "react";
import { Progress, User } from "../types";

export type SettingsContextType = {
  mode: "guest" | "user";
  setMode: (v: "guest" | "user") => void;
  authorized: boolean;
  setAuthorized: (v: boolean) => void;
  id: string | null;
  setId: (v: string | null) => void;
};

export type ExerciseContextType = {
  verbs: string[][];
  selectedVerbs: string[][];
  setSelectedVerbs: (v: string[][]) => void;
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
