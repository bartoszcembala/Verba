import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import DATA from "../data/verbs";

type Word = [string, string];

type Module = {
  name: string;
  words: string[][];
};

type AccountType = {
  name: string;
  wordsLearned: number;
  modulesPercent: Record<string, any[]>; // np. tablice z procentami lub innymi danymi
  notLearned: Record<string, Word[]>;
};

type AccountContextType = {
  account: AccountType;
  setAccount: Dispatch<SetStateAction<AccountType>>;
  logged: boolean;
  setLogged: Dispatch<SetStateAction<boolean>>;
};

export const AccountCtx = createContext<AccountContextType | undefined>(
  undefined
);

const modulesPercentObj = (): Record<string, any[]> => {
  const modulesPercent: Record<string, any[]> = {};
  Object.entries(DATA).forEach(([_, module]: [string, Module]) => {
    modulesPercent[module.name] = [];
  });
  return modulesPercent;
};

const notLearnedObj = (): Record<string, Word[]> => {
  const notLearned: Record<string, Word[]> = {};
  Object.entries(DATA).forEach(([_, module]: [string, Module]) => {
    notLearned[module.name] = module.words.map((word) => [word[0], word[1]]);
  });
  return notLearned;
};

type Props = {
  children: ReactNode;
};

function AccountContext({ children }: Props) {
  const [logged, setLogged] = useState<boolean>(false);
  const [account, setAccount] = useState<AccountType>({
    name: "John",
    wordsLearned: 0,
    modulesPercent: modulesPercentObj(),
    notLearned: notLearnedObj(),
  });

  return (
    <AccountCtx.Provider value={{ account, setAccount, logged, setLogged }}>
      {children}
    </AccountCtx.Provider>
  );
}

export default AccountContext;
