import "../index.css";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Exercise/Sidebar";
import { useProgression } from "../lib/queries/progressionQueries";
import { useProgress } from "../lib/queries/progressQueries";
import Chart from "../components/Exercise/Chart";
import Main from "../components/Exercise/Main";
import type { WordPair } from "../types";
import { useModules } from "../lib/queries/modulesQueries";
import { useExerciseSession } from "../components/Exercise/useExerciseSession";
import { useCurrentUser } from "../lib/queries/userQueries";

function Exercise({ initVerbs }: { initVerbs: WordPair[] }) {
  const { progress } = useProgress();
  const { user } = useCurrentUser();
  const { recordActivity } = useProgression();

  const module = useLocation().pathname.slice(1);

  const userId = user?._id;

  const { modules } = useModules();
  const moduleDisplayName = modules?.find(
    (m) => m.title === module
  )?.displayName;
  const activeProgress = progress?.find(
    (p) => p.moduleName === module && p.userName === user?.email
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const session = useExerciseSession({
    verbs: initVerbs,
    moduleName: module,
    user: user ?? null,
    activeProgress,
  });

  useEffect(() => {
    if (userId) {
      void recordActivity({ path: module, label: moduleDisplayName ?? module });
    }
  }, [module, moduleDisplayName, recordActivity, userId]);

  return (
    <>
      <Toaster />
        <div className="mx-auto mb-6 flex max-w-[128rem] justify-end lg:hidden">
          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="w-full cursor-pointer rounded-lg border border-neutral-300 px-4 py-3 text-[1.4rem] font-medium dark:border-neutral-700"
          >
            {isSidebarVisible ? "Close word list" : "Show word list"}
          </button>
        </div>

        <div className="mx-auto flex max-w-[128rem] flex-col gap-6 lg:grid lg:grid-cols-[30rem_minmax(0,1fr)_22rem] lg:items-start">
          {/* Sidebar na małych ekranach */}
          {isSidebarVisible && (
            <Sidebar session={session} verbs={initVerbs} activeProgress={activeProgress} className="lg:hidden" />
          )}

          {/* Sidebar na dużych ekranach */}
          <div className="hidden lg:block">
            <Sidebar session={session} verbs={initVerbs} activeProgress={activeProgress} />
          </div>

          {/* Główna zawartość */}
          <Main session={session} />

          {/* Wykres */}
          <Chart stats={session.stats} />
        </div>
    </>
  );
}

export default Exercise;
