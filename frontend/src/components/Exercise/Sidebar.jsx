/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { useContext } from "react";
import { AccountCtx } from "../../lib/AccountContext";
import { ExerciseContext } from "../../lib/contexts";
import {
  useEditProgress,
  useProgress,
} from "../../lib/queries/progressQueries";
import { useQueryClient } from "@tanstack/react-query";

function Sidebar({ setCorrect, className = "" }) {
  const queryClient = useQueryClient();
  const { mode, verbs, selectedVerbs, setSelectedVerbs, module, user } =
    useContext(ExerciseContext);
  const { account, setAccount } = useContext(AccountCtx);
  const { progress } = useProgress();
  const { editProgress } = useEditProgress();
  const activeProgress = progress?.find(
    (p) => p.moduleName === module && p.userName === user?.email
  );

  function addVerb(verb) {
    if (selectedVerbs.includes(verb)) {
      setSelectedVerbs((prevVerbs) => prevVerbs.filter((v) => v !== verb));
      toast.success("Czasownik usunięty.");
    } else {
      setSelectedVerbs((prevVerbs) => [...prevVerbs, verb]);
      toast.success("Czasownik dodany.");
    }
  }

  return (
    <div
      className={` ml-4 px-12 overflow-y-auto max-h-[90vh] relative dark:bg-neutral-700/70 rounded-3xl bg-white border-1 dark:border-none border-neutral-300 ${className}`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="py-6 mb-6 flex gap-3 border-b-2">
        <button
          className="border-1 cursor-pointer border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors px-4 py-2 rounded-xl"
          onClick={() => setSelectedVerbs(verbs)}
        >
          Add all
        </button>
        <button
          className="border-1 cursor-pointer border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors px-4 py-2 rounded-xl"
          onClick={() => {
            mode === "guest"
              ? setSelectedVerbs(account.notLearned[module])
              : setSelectedVerbs(
                  verbs.filter(
                    (item) => !activeProgress?.learned.flat().includes(item[0])
                  )
                );
          }}
        >
          Add not learned
        </button>
        <button
          className="border-1 cursor-pointer border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors px-4 py-2 rounded-xl"
          onClick={() => {
            editProgress({ id: activeProgress._id, data: { learned: [] } });
            queryClient.invalidateQueries({ queryKey: ["progress"] });
            const acc = {
              ...account,
              modulesPercent: {
                ...account.modulesPercent,
                [module]: [],
              },
              notLearned: {
                ...account.notLearned,
                [module]: [...verbs],
              },
            };
            setCorrect((prev) => [
              { ...prev[0], value: [] },
              { ...prev[1], value: [...verbs] },
            ]);
            setAccount(acc);
            localStorage.setItem("account", JSON.stringify(acc));
          }}
        >
          Reset progress
        </button>
      </div>
      {verbs.length >= 1 ? (
        verbs.map((verb) => (
          <div key={verb[0]} className="flex items-center gap-4 pb-2 ">
            <span>
              {mode === "guest"
                ? account.modulesPercent[module].includes(verb[0])
                  ? "🟩"
                  : "🟥"
                : progress
                    ?.find(
                      (p) =>
                        p.moduleName === module && p.userName === user.email
                    )
                    ?.learned?.flat()
                    .includes(verb[0])
                ? "🟩"
                : "🟥"}
            </span>
            <span className="cursor-pointer">🔈</span>
            <p>{verb[0] + ` (${verb[1]})`}</p>
            <button
              className="border-1 cursor-pointer uppercase text-3xl border-neutral-300 rounded-xl px-3 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              onClick={() => addVerb(verb)}
            >
              {selectedVerbs.some(([element]) => element === verb[0])
                ? "-"
                : "+"}
            </button>
          </div>
        ))
      ) : (
        <div className="load">Loading</div>
      )}
    </div>
  );
}

export default Sidebar;
