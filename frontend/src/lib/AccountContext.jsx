/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import DATA from "../data/verbs";

export const AccountCtx = createContext();

const modulesPercentObj = function modulesPercentGenerator() {
  let modulesPercent = {};
  Object.entries(DATA).map(([_, module]) => (modulesPercent[module.name] = []));
  return modulesPercent;
};

const notLearnedObj = function notLearnedGenerator() {
  let notLearned = {};
  Object.entries(DATA).map(([_, module]) => {
    notLearned[module.name] = module.words.map((word) => [word[0], word[1]]);
  });
  return notLearned;
};

function AccountContext({ children }) {
  const [logged, setLogged] = useState(false);
  const [account, setAccount] = useState({
    name: "John",
    wordsLearned: 0,
    modulesPercent: modulesPercentObj(),
    notLearned: notLearnedObj(),
  });

  return (
    <AccountCtx.Provider
      value={{
        account,
        setAccount,
        logged,
        setLogged,
      }}
    >
      {children}
    </AccountCtx.Provider>
  );
}

export default AccountContext;
