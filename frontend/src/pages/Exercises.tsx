import { useState } from "react";
import { Link } from "react-router-dom";
import { calculatePercent } from "../lib/calculatePercent";
import { useModules } from "../lib/queries/modulesQueries";
import { useProgress } from "../lib/queries/progressQueries";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiOutlinePlay } from "react-icons/hi2";
import { User } from "../types";
import { FaMagnifyingGlass } from "react-icons/fa6";

function Exercises() {
  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();
  const [show, setShow] = useState<string>("undefined");
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredModules = modules?.filter((mod) =>
    mod.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const list = (
    <div className="mt-4">
      {modules &&
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
                  <p className="text-3xl md:text-3xl">{mod.displayName}</p>
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

  function exercisesCount(category: string) {
    let count = 0;
    modules!.map((mod) => {
      if (mod.title.includes(category)) {
        count++;
      }
    });

    return count;
  }

  function handleShowAll() {
    setSearchTerm("");
  }

  return (
    <div className="flex items-center justify-center w-full px-2">
      <div className="flex flex-col items-center justify-center w-full max-w-[80rem] gap-7">
        <div className="flex gap-5 justify-around items-center w-full bg-gradient-to-b from-indigo-500/30  dark:to-[#171717] to-neutral-200 px-5 py-6 rounded-2xl mb-8 h-[8rem]">
          <FaMagnifyingGlass className="w-8 h-8" />
          <input
            placeholder="Search for an exercise..."
            value={searchTerm}
            type="text"
            className="focus:border-2 focus:border-indigo-400 hover:border-2 hover:border-indigo-200 h-[3.5rem] text-neutral-900 px-5 py-1 bg-neutral-100 dark:bg-neutral-300 w-[80%] rounded-2xl"
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <div
            className="uppercase bg-neutral-100  hover:border-indigo-200 h-[3.5rem] text-neutral-900 px-5 py-1 dark:bg-neutral-300 rounded-2xl cursor-pointer"
            onClick={handleShowAll}
          >
            all
          </div>
        </div>
        {searchTerm.length === 0 ? (
          ["verbs", "nouns",  "dom", "jedzenie", "rodzina"].map(
            (category) => (
              <div
                key={category}
                className="w-full cursor-pointer dark:border-none bg-white border border-neutral-300 dark:bg-neutral-700/70 rounded-2xl py-6 px-5"
              >
                <div
                  className="flex justify-between items-center"
                  onClick={() =>
                    setShow(show === category ? "undefined" : category)
                  }
                >
                  <p className="text-4xl capitalize">{category}</p>

                  <div className="flex justify-center items-center">
                    <span className="mr-10 tracking-wide text-3xl text-neutral-400">
                      {exercisesCount(category)} exercises
                    </span>
                    {show === category ? (
                      <FaChevronUp className="text-indigo-500 w-10 h-10" />
                    ) : (
                      <FaChevronDown className="text-indigo-500 w-10 h-10" />
                    )}
                  </div>
                </div>
                {show === category && list}
              </div>
            )
          )
        ) : (
          <div className="w-full cursor-pointer rounded-2xl px-5">
            {" "}
            {filteredModules?.map((mod) => {
              const wordsNumber =
                progress?.find(
                  (m) =>
                    m.moduleName === mod.title && m.userName === user?.email
                )?.learned.length || 0;

              return (
                <Link
                  key={mod._id}
                  to={`/${mod.title}`}
                  className="flex justify-between  px-4 py-6 dark:hover:bg-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <div className="flex gap-4 sm:gap-8 items-center">
                    <p className="text-3xl font-semibold">
                      {calculatePercent(wordsNumber, mod.words.length)}%
                    </p>
                    <p className="text-3xl md:text-3xl">{mod.displayName}</p>
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Exercises;
