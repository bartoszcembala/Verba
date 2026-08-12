import { createContext } from "react";

export type SettingsContextType = {
  mode: "guest" | "user";
  setMode: (v: "guest" | "user") => void;
  authorized: boolean;
  setAuthorized: (v: boolean) => void;
  authLoading: boolean;
  id: string | null;
  setId: (v: string | null) => void;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);
