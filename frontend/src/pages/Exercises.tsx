import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AccountCtx } from "../lib/AccountContext";
import {
  calculatePercent,
  calculatePercentContext,
} from "../lib/calculatePercent";
import DATA from "../data/verbs";
import { SettingsContext } from "../lib/contexts";
import { useModules } from "../lib/queries/modulesQueries";
import { useProgress } from "../lib/queries/progressQueries";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { HiOutlinePlay } from "react-icons/hi2";

function Exercises() {
  const { account } = useContext(AccountCtx)!;
  const { mode, authorized } = useContext(SettingsContext)!;
  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();
  const [show, setShow] = useState<string>("undefined");

  const list = (
    <div className="mt-4">
      {mode === "user" &&
        authorized &&
        modules &&
        progress &&
        modules.map((mod) => {
          if (!mod.title.includes(show)) return null;
          const wordsNumber =
            progress.find((m) => m.moduleName === mod.title)?.learned.length ||
            0;

          return (
            <Link
              key={mod._id}
              to={`/${mod.title}`}
              className="flex justify-between border-t-1  px-4 py-8 dark:hover:bg-neutral-700 hover:bg-neutral-200 transition-colors border-neutral-400"
            >
              <div className="flex gap-10 justify-center items-center">
                <p className="text-2xl">
                  {calculatePercent(wordsNumber, mod.words.length)}%
                </p>
                <p>{`${mod.title.slice(0, -2)} `}</p>
                <p className="ml-2 bg-green-700 inline-block px-4  text-2xl rounded-lg">{`${mod.title
                  .slice(-2)
                  .toUpperCase()}`}</p>
              </div>
              <HiOutlinePlay className="text-indigo-500 w-10 h-10" />
            </Link>
          );
        })}
    </div>
  );

  if (isLoadingModules || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-48 h-48 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  function percentWEmoji(val1: number, val2: number) {
    const percent = calculatePercent(val1, val2);
    let emoji = "";

    if (percent >= 80) emoji = "🟩";
    else if (percent >= 50) emoji = "🟨";
    else if (percent >= 25) emoji = "🟧";
    else emoji = "🟥";

    return `${emoji} ${percent}`;
  }

  function percentWEmojiContext(val1: number, val2: number) {
    const percent = calculatePercentContext(val1, val2);
    let emoji = "";

    if (percent >= 80) emoji = "🟩";
    else if (percent >= 50) emoji = "🟨";
    else if (percent >= 25) emoji = "🟧";
    else emoji = "🟥";

    return `${emoji} ${percent}`;
  }

  return (
    <div className="flex items-center justify-center  ">
      <div className="flex flex-col items-center justify-center w-[80rem] gap-10 ">
        {/* verbs */}
        <div className="w-[80rem] cursor-pointer dark:border-none bg-white border-1 border-neutral-300 dark:bg-neutral-700/70 rounded-2xl py-3 px-5">
          <div
            className="flex justify-between "
            onClick={() => {
              if (show === "verbs") {
                setShow("undefined");
              } else {
                setShow("verbs");
              }
            }}
          >
            <p>Verbs:</p>
            {show === "verbs" ? (
              <FaChevronUp className="text-indigo-500" />
            ) : (
              <FaChevronDown className="text-indigo-500" />
            )}
          </div>
          {show === "verbs" && list}
        </div>

        {/* nouns */}
        <div className="w-[80rem] cursor-pointer bg-white border-1 border-neutral-300 dark:bg-neutral-700/70 rounded-xl py-3 px-5 dark:border-none">
          <div
            className="flex justify-between"
            onClick={() => {
              if (show === "nouns") {
                setShow("undefined");
              } else {
                setShow("nouns");
              }
            }}
          >
            <p>Nouns:</p>
            {show === "nouns" ? (
              <FaChevronUp className="text-indigo-500" />
            ) : (
              <FaChevronDown className="text-indigo-500" />
            )}
          </div>
          {show === "nouns" && list}
        </div>

        {mode === "guest" &&
          Object.entries(DATA).map(([key, module]) => (
            <Link
              key={key}
              to={`/${module.name}`}
              className="bg-neutral-900 w-full h-34 rounded-2xl flex items-center justify-center text-4xl text-white font-bold hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400"
            >
              {module.nameDisplay.toUpperCase()}{" "}
              {percentWEmojiContext(
                account.modulesPercent[module.name]?.length || 0,
                account.notLearned[module.name]?.length || 1
              )}
              %
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Exercises;
