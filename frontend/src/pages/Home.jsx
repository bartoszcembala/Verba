/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "../App.css";
import { useContext } from "react";
import { AccountCtx } from "../lib/AccountContext";
import {
  calculatePercent,
  calculatePercentContext,
} from "../lib/calculatePercent";
import DATA from "../data/verbs";
import { SettingsContext } from "../lib/contexts";
import { useModules, useProgress } from "../lib/queries";

function Home() {
  const { account } = useContext(AccountCtx);
  const { mode, authorized } = useContext(SettingsContext);
  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();

  if (isLoadingModules || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-48 h-48 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  function percentWEmoji(val1, val2) {
    const percent = calculatePercent(val1, val2);
    let emoji = "";

    if (percent >= 80) {
      emoji = "🟩";
    } else if (percent >= 50) {
      emoji = "🟨";
    } else if (percent >= 25) {
      emoji = "🟧";
    } else if (percent >= 0) {
      emoji = "🟥";
    }

    return emoji + " " + percent;
  }
  function percentWEmojiContext(val1, val2) {
    const percent = calculatePercentContext(val1, val2);
    let emoji = "";

    if (percent >= 80) {
      emoji = "🟩";
    } else if (percent >= 50) {
      emoji = "🟨";
    } else if (percent >= 25) {
      emoji = "🟧";
    } else if (percent >= 0) {
      emoji = "🟥";
    }

    return emoji + " " + percent;
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center w-[80rem] gap-10">
        {mode === "user" &&
          authorized &&
          modules &&
          progress &&
          modules.map((module) => {
            const wordsNumber = progress.find(
              (m) => m.moduleName === module.title
            )?.learned.length;

            return (
              <Link
                key={module._id}
                to={`/${module.title}`}
                className="w-full h-34 rounded-2xl flex items-center justify-center text-4xl text-white font-bold hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400"
              >
                {`${module.title.slice(0, -2).toUpperCase()} ${module.title
                  .slice(-2)
                  .toUpperCase()}`}{" "}
                {percentWEmoji(wordsNumber, module.words.length)}%
              </Link>
            );
          })}
        {mode === "guest" &&
          Object.entries(DATA).map(([key, module]) => (
            <Link
              key={key}
              to={`/${module.name}`}
              className="bg-neutral-900 w-full h-34 rounded-2xl flex items-center justify-center text-4xl text-white font-bold hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400"
            >
              {module.nameDisplay.toUpperCase()}{" "}
              {percentWEmojiContext(
                account.modulesPercent[module.name].length,
                account.notLearned[module.name].length
              )}
              %
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Home;
