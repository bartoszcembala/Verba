/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { useContext } from "react";
import { ExerciseContext } from "../../lib/contexts";
import {
  useEditProgress,
  useProgress,
} from "../../lib/queries/progressQueries";
import { useQueryClient } from "@tanstack/react-query";

function Sidebar({ setCorrect, className = "" }) {
  const queryClient = useQueryClient();
  const { verbs, selectedVerbs, setSelectedVerbs, module, user } =
    useContext(ExerciseContext);
  const { progress } = useProgress();
  const { editProgress } = useEditProgress();
  const activeProgress = progress?.find(
    (p) => p.moduleName === module && p.userName === user?.email
  );

  function addVerb(verb) {
    if (selectedVerbs.includes(verb)) {
      setSelectedVerbs((prevVerbs) => prevVerbs.filter((v) => v !== verb));
      toast.success("Word removed.");
    } else {
      setSelectedVerbs((prevVerbs) => [...prevVerbs, verb]);
      toast.success("Word added.");
    }
  }

  return (
    <div
      className={` border-indigo-700 border-1 ml-4 px-12 pb-4 overflow-y-auto max-h-[90vh] relative dark:bg-neutral-800 shadow-[0_0_20px_rgba(44,44,44,0.9)]  rounded-3xl bg-white  ${className}`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="font-semibold py-6 mb-6 flex gap-3 border-b-2">
        <button
          className=" border-1 cursor-pointer border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors px-3 py-3 rounded-xl leading-9"
          onClick={() => setSelectedVerbs(verbs)}
        >
          Add all
        </button>
        <button
          className="border-1 cursor-pointer border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors px-3 py-3 rounded-xl leading-9"
          onClick={() => {
            setSelectedVerbs(
              verbs.filter(
                (item) => !activeProgress?.learned.flat().includes(item[0])
              )
            );
          }}
        >
          Add not learned
        </button>
        <button
          className="border-1 cursor-pointer border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors px-3 py-3 rounded-xl leading-9"
          onClick={() => {
            editProgress({ id: activeProgress._id, data: { learned: [] } });
            queryClient.invalidateQueries({ queryKey: ["progress"] });

            setCorrect((prev) => [
              { ...prev[0], value: [] },
              { ...prev[1], value: [...verbs] },
            ]);
          }}
        >
          Reset progress
        </button>
      </div>
      {verbs.length >= 1 ? (
        verbs.map((verb) => (
          <div key={verb[0]} className="flex  items-center gap-4 pb-2 ">
            {progress
              ?.find(
                (p) => p.moduleName === module && p.userName === user.email
              )
              ?.learned?.flat()
              .includes(verb[0]) ? (
              <span className="w-8 h-8  rounded-md bg-[#3c6847]" />
            ) : (
              <span className="w-8 h-8  rounded-md bg-[#6f4242]" />
            )}

            <span className="cursor-pointer">🔈</span>
            <p>{verb[0] + ` (${verb[1]})`}</p>
            <button
              className={`${
                selectedVerbs.some(([element]) => element === verb[0]) &&
                "bg-neutral-600"
              } border-1 cursor-pointer uppercase text-3xl border-neutral-300 rounded-xl px-3 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors`}
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
