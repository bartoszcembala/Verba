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
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiOutlinePlay } from "react-icons/hi2";
import { User } from "../types";

function Exercises() {
  const { account } = useContext(AccountCtx)!;
  const { mode, authorized } = useContext(SettingsContext)!;
  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();
  const [show, setShow] = useState<string>("undefined");
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const list = (
    <div className="mt-4">
      {mode === "user" &&
        authorized &&
        modules &&
        progress &&
        modules.map((mod) => {
          if (mod.title.includes(show)) {
            const wordsNumber =
              progress.find(
                (m) => m.moduleName === mod.title && m.userName === user?.email
              )?.learned.length || 0;

            return (
              <Link
                key={mod._id}
                to={`/${mod.title}`}
                className="flex justify-between border-t px-4 py-6 dark:hover:bg-neutral-700 hover:bg-neutral-200 transition-colors border-neutral-400"
              >
                <div className="flex gap-4 sm:gap-8 items-center">
                  <p className="text-3xl font-semibold">
                    {calculatePercent(wordsNumber, mod.words.length)}%
                  </p>
                  <p className="text-3xl md:text-3xl">
                    {mod.displayName}
                  </p>
                  <p
                    className={`ml-0 sm:ml-2 text-xl sm:text-2xl px-4 rounded-lg ${
                      mod.level.startsWith("A") && "bg-green-600/85"
                    } ${mod.level.startsWith("B") && "bg-yellow-500/85"} ${
                      mod.level.startsWith("C") && "bg-red-500/85"
                    }`}
                  >
                    {mod.level}
                  </p>
                </div>
                <HiOutlinePlay className="text-indigo-500 w-8 h-8 sm:w-10 sm:h-10 mt-4 sm:mt-0" />
              </Link>
            );
          }
        })}
    </div>
  );

  if (isLoadingModules || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
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
    <div className="flex items-center justify-center w-full px-2">
      <div className="flex flex-col items-center justify-center w-full max-w-[80rem] gap-7">
        {["verbs", "nouns", "hobbit", "dom"].map((category) => (
          <div
            key={category}
            className="w-full cursor-pointer dark:border-none bg-white border border-neutral-300 dark:bg-neutral-700/70 rounded-2xl py-4 px-5"
          >
            <div
              className="flex justify-between items-center"
              onClick={() =>
                setShow(show === category ? "undefined" : category)
              }
            >
              <p className="text-4xl capitalize">
                {category}
              </p>
              {show === category ? (
                <FaChevronUp className="text-indigo-500 w-10 h-10" />
              ) : (
                <FaChevronDown className="text-indigo-500 w-10 h-10" />
              )}
            </div>
            {show === category && list}
          </div>
        ))}

        {mode === "guest" &&
          Object.entries(DATA).map(([key, module]) => (
            <Link
              key={key}
              to={`/${module.name}`}
              className="bg-neutral-900 w-full text-center py-8 rounded-2xl text-3xl sm:text-4xl text-white font-bold hover:bg-neutral-800 transition duration-200 border border-neutral-400"
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
