import { User } from "../../types";

import { FaFlagCheckered } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { IoBulbOutline } from "react-icons/io5";

import { calculatePercent } from "../../lib/calculatePercent";
import { useGetDailyQuests } from "../../lib/queries/dailyQuestsQueries";

import Spinner from "../Spinner";

export default function DailyQuests() {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const { dailyQuests } = useGetDailyQuests();
  const todayDailyQuests =
    dailyQuests && dailyQuests.find((item) => item.userId === user?._id);
  const iconStore: Record<string, JSX.Element> = {
    flag: <FaFlagCheckered />,
    clock: <IoMdTime />,
    bulb: <IoBulbOutline />,
  };

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[1.25rem] text-neutral-500">Today&apos;s progress</p>
          <h2 className="mt-1 text-[2.2rem] font-semibold">Daily quests</h2>
        </div>
        <span className="rounded-md bg-neutral-100 px-3 py-1 text-[1.25rem] font-semibold dark:bg-neutral-800">
          {todayDailyQuests?.quests.filter((quest) => quest.completed).length ?? 0}/{todayDailyQuests?.quests.length ?? 3}
        </span>
      </div>
      {todayDailyQuests ? (
        <div className="mt-6 divide-y divide-neutral-100 dark:divide-neutral-800">
          {todayDailyQuests.quests.map((quest, index) => (
            <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg [&>svg]:h-7 [&>svg]:w-7 ${quest.completed ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"}`}>
                {iconStore[quest.icon]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex justify-between gap-3 text-[1.35rem]">
                  <strong className="truncate font-medium">{quest.title}</strong>
                  <span className="shrink-0 text-neutral-500">{quest.progress} / {quest.toObtain}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <span className={`block h-full ${quest.completed ? "bg-emerald-600" : "bg-indigo-600"}`} style={{ width: `${calculatePercent(quest.progress, quest.toObtain)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Spinner />
      )}
    </section>
  );
}
