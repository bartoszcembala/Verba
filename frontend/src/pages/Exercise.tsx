import "../index.css";
import { useContext, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { ExerciseContext, SettingsContext } from "../lib/contexts";
import Sidebar from "../components/Exercise/Sidebar";
import { useProgression } from "../lib/queries/progressionQueries";
import { useAddProgress, useProgress } from "../lib/queries/progressQueries";
import Chart from "../components/Exercise/Chart";
import Main from "../components/Exercise/Main";
import { User, type WordPair } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useModules } from "../lib/queries/modulesQueries";
import type { AnswerStat } from "../components/Exercise/types";

function Exercise({ initVerbs }: { initVerbs: WordPair[] }) {
  const queryClient = useQueryClient();

  const { progress } = useProgress();
  const { addProgress } = useAddProgress();
  const { recordActivity } = useProgression();

  const { mode } = useContext(SettingsContext)!;

  const module = useLocation().pathname.slice(1);

  const storedUser = localStorage.getItem("user");
  const user = useMemo<User | null>(
    () => storedUser ? JSON.parse(storedUser) as User : null,
    [storedUser],
  );
  const userId = user?._id;

  const { modules } = useModules();
  const moduleDisplayName = modules?.find(
    (m) => m.title === module
  )?.displayName;
  const activeProgress = progress?.find(
    (p) => p.moduleName === module && p.userName === user?.email
  );
  const verbs = [...initVerbs];

  const [selectedVerbs, setSelectedVerbs] = useState<WordPair[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [correct, setCorrect] = useState<AnswerStat[]>([
    {
      name: "correct",
      value: activeProgress?.learned.length ?? 0,
      color: "#34563c",
    },
    {
      name: "wrong",
      value: initVerbs.length - (activeProgress?.learned.length ?? 0),
      color: "#563434",
    },
  ]);

  useEffect(() => {
    if (userId) {
      void recordActivity({ path: module, label: moduleDisplayName ?? module });
    }
  }, [module, moduleDisplayName, recordActivity, userId]);

  useEffect(() => {
    if (!progress) return;

    if (
      user &&
      mode === "user" &&
      !progress.some(
        (p) => p.moduleName === module && p.userName === user?.email
      )
    ) {
      const progressObj = {
        moduleName: module,
        userName: user.email,
        learned: [],
      };

      addProgress(progressObj, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["progress"] });
        },
      });
    }

    setCorrect([
      {
        name: "correct",
        value: activeProgress?.learned.length ?? 0,
        color: "#34563c",
      },
      {
        name: "wrong",
        value: initVerbs.length - (activeProgress?.learned.length ?? 0),
        color: "#563434",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <>
      <Toaster />
      <ExerciseContext.Provider
        value={{
          verbs,
          selectedVerbs,
          setSelectedVerbs,
          progress,
          module,
          user,
        }}
      >
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
            <Sidebar setCorrect={setCorrect} className="lg:hidden" />
          )}

          {/* Sidebar na dużych ekranach */}
          <div className="hidden lg:block">
            <Sidebar setCorrect={setCorrect} />
          </div>

          {/* Główna zawartość */}
          <Main />

          {/* Wykres */}
          <Chart correct={correct} activeProgress={activeProgress} />
        </div>
      </ExerciseContext.Provider>
    </>
  );
}

export default Exercise;
