import toast from "react-hot-toast";
import type { Progress, WordPair } from "../../types";
import type { ExerciseSession } from "./useExerciseSession";

type SidebarProps = {
  session: ExerciseSession;
  verbs: WordPair[];
  activeProgress?: Progress;
  className?: string;
};

function Sidebar({ session, verbs, activeProgress, className = "" }: SidebarProps) {
  const { state } = session;

  function addVerb(verb: WordPair) {
    if (state.selectedWords.some(([word]) => word === verb[0])) {
      toast.success("Word removed.");
    } else {
      toast.success("Word added.");
    }
    session.toggleWord(verb);
  }

  return (
    <div
      className={`max-h-[72vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="mb-4 grid grid-cols-2 gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
        <button
          className="cursor-pointer rounded-md border border-neutral-300 px-2 py-2 text-[1.15rem] font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          onClick={session.selectAll}
        >
          Add all
        </button>
        <button
          className="cursor-pointer rounded-md border border-neutral-300 px-2 py-2 text-[1.15rem] font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          onClick={session.selectUnlearned}
        >
          Add not learned
        </button>
        <button
          className="col-span-2 cursor-pointer rounded-md px-2 py-2 text-[1.15rem] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={async () => {
            if (!activeProgress) return;
            await session.resetProgress();
            toast.success("Progress reset.");
          }}
        >
          Reset progress
        </button>
      </div>
      {verbs.length >= 1 ? (
        verbs.map((verb) => (
          <div key={verb[0]} className="flex items-center gap-3 border-b border-neutral-100 py-2 last:border-0 dark:border-neutral-800">
            {activeProgress?.learned.some(([word]) => word === verb[0]) ? (
              <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-500" />
            ) : (
              <span className="h-3 w-3 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            )}

            <p className="min-w-0 flex-1 truncate text-[1.3rem]">{verb[0]} <span className="text-neutral-500">({verb[1]})</span></p>
            <button
              className={`${
                state.selectedWords.some(([element]) => element === verb[0]) &&
                "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
              } grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-neutral-300 text-[1.4rem] hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800`}
              onClick={() => addVerb(verb)}
            >
              {state.selectedWords.some(([element]) => element === verb[0])
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
