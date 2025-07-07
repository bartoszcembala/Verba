import "../index.css";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { AccountCtx } from "../lib/AccountContext";
import { ExerciseContext, SettingsContext } from "../lib/contexts";
import Sidebar from "../components/Exercise/Sidebar";
import { useActivity } from "../lib/queries/userQueries";
import { useAddProgress, useProgress } from "../lib/queries/progressQueries";
import Chart from "../components/Exercise/Chart";
import Main from "../components/Exercise/Main";
import { User } from "../types";
import { useQueryClient } from "@tanstack/react-query";

function Exercise({ initVerbs }: { initVerbs: string[][] }) {
  const queryClient = useQueryClient();

  const { progress } = useProgress();
  const { addProgress } = useAddProgress();
  const { addActivity } = useActivity();

  const { account, setAccount } = useContext(AccountCtx)!;
  const { mode } = useContext(SettingsContext)!;

  const module = useLocation().pathname.slice(1);

  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser
    ? (JSON.parse(storedUser) as User)
    : null;

  const activeProgress = progress?.find(
    (p) => p.moduleName === module && p.userName === user?.email
  );
  const verbs = [...initVerbs];

  const [selectedVerbs, setSelectedVerbs] = useState<string[][]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [correct, setCorrect] = useState(
    account
      ? [
          {
            name: "correct",
            value: account?.modulesPercent[module] || {},
            color: "#34563c",
          },
          {
            name: "wrong",
            value: account?.notLearned[module] || {},
            color: "#563434",
          },
        ]
      : [
          {
            name: "correct",
            value: activeProgress?.learned.length,
            color: "#34563c",
          },
          {
            name: "wrong",
            value: initVerbs.length - activeProgress?.learned.length!,
            color: "#563434",
          },
        ]
  );

  useEffect(() => {
    if (user) {
      const arrWithout = user.latestActivity.filter((item) => item !== module);
      const readyArr = [...arrWithout, module];

      while (readyArr.length > 3) {
        readyArr.shift();
      }

      addActivity({
        id: user._id,
        activities: readyArr,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, latestActivity: readyArr.reverse() })
      );
    }
  }, []);

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
        value: activeProgress?.learned.length,
        color: "#34563c",
      },
      {
        name: "wrong",
        value: initVerbs.length - activeProgress?.learned.length!,
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
          mode,
          verbs,
          selectedVerbs,
          setSelectedVerbs,
          progress,
          module,
          user,
        }}
      >
        <div className="lg:hidden flex justify-end mb-8">
          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-xl cursor-pointer w-full"
          >
            {isSidebarVisible ? "Close word list" : "Show word list"}
          </button>
        </div>

        <div className="flex flex-col justify-center lg:items-stretch items-center lg:grid  lg:grid-cols-[4fr_8fr_3fr] gap-16 dark:text-white">
          {/* Sidebar na małych ekranach */}
          {isSidebarVisible && (
            <Sidebar setCorrect={setCorrect} className="lg:hidden" />
          )}

          {/* Sidebar na dużych ekranach */}
          <div className="hidden lg:block">
            <Sidebar setCorrect={setCorrect} />
          </div>

          {/* Główna zawartość */}
          <Main
            account={account}
            setAccount={setAccount}
            setCorrect={setCorrect}
          />
          {/* Wykres */}
          <Chart
            correct={correct}
            activeProgress={activeProgress}
            mode={mode}
          />
        </div>
      </ExerciseContext.Provider>
    </>
  );
}

export default Exercise;
