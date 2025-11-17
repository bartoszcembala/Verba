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
    flag: <FaFlagCheckered className="h-16 w-16" />,
    clock: <IoMdTime className="h-16 w-16" />,
    bulb: <IoBulbOutline className="h-16 w-16" />,
  };

  return (
    <div className="bg-white border-1 shadow-xs border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-8 h-[35rem] dark:border-2 dark:border-indigo-500 mb-10">
      <h3 className="text-4xl mb-5 pb-5 text-center border-b-2 border-indigo-500 ">
        Daily Quests:{" "}
      </h3>
      {todayDailyQuests ? (
        <div className="grid grid-cols-2 gap-y-10">
          {todayDailyQuests.quests.map((quest, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-3 relative"
            >
              <p>{quest.title}</p>

              {iconStore[quest.icon]}

              <p>
                {quest.progress}/{quest.toObtain} (
                {calculatePercent(quest.progress, quest.toObtain)}%)
              </p>

              {quest.completed && (
                <span className="absolute rotate-14 bg-indigo-500/90 px-4 top-20 rounded-lg">
                  COMPLETED
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
