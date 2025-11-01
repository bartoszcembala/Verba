import { Link } from "react-router-dom";
import { User } from "../types";
import { getPreviousDates } from "../lib/getPreviousDates";
import { HiOutlinePlay } from "react-icons/hi2";
import { FaFlagCheckered } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { IoBulbOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { useGetDailyQuests } from "../lib/queries/dailyQuestsQueries";
import { calculatePercent } from "../lib/calculatePercent";
import Spinner from "../components/Spinner";
import { useUpdateDailyQuests } from "../lib/useUpdateDailyQuests";
import { LuCrown } from "react-icons/lu";
import { useState } from "react";
import DailyQuiz from "../components/DailyQuiz";

function Home() {
  const levels = [
    { level: 1, name: "Novice", xp: 0 },
    { level: 2, name: "Learner", xp: 150 },
    { level: 3, name: "Beginner", xp: 400 },
    { level: 4, name: "Word Seeker", xp: 800 },
    { level: 5, name: "Phrase Tamer", xp: 1300 },
    { level: 6, name: "Apprentice", xp: 2000 },
    { level: 7, name: "Converser", xp: 2900 },
    { level: 8, name: "Language Explorer", xp: 4000 },
    { level: 9, name: "Proficient", xp: 5300 },
    { level: 10, name: "Advanced", xp: 6800 },
    { level: 11, name: "Idiom Master", xp: 8500 },
    { level: 12, name: "Expert", xp: 10500 },
    { level: 13, name: "Mentor", xp: 13000 },
    { level: 14, name: "Polyglot", xp: 16000 },
    { level: 15, name: "Legendary Linguist", xp: 20000 },
  ];

  function getUserLevel(userXP: number) {
    let currentLevel = levels[0];

    for (let i = 0; i < levels.length; i++) {
      if (userXP >= levels[i].xp) {
        currentLevel = levels[i];
      } else {
        const nextLevel = levels[i];
        return {
          level: currentLevel.level,
          levelName: currentLevel.name,
          xpToNextLevel: nextLevel.xp - userXP,
          nextLevelXP: nextLevel.xp,
          totalXP: userXP,
        };
      }
    }
    return {
      level: currentLevel.level,
      levelName: currentLevel.name,
      xpToNextLevel: 0,
      nextLevelXP: null,
      totalXP: userXP,
    };
  }

  const { handleDeleteDailyQuest } = useUpdateDailyQuests();
  const { dailyQuests } = useGetDailyQuests();

  const previousDates = getPreviousDates(7);
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const timeSpent = user?.timeSpentLearning
    .slice(-7)
    .reduce((sum, curr) => sum + curr.value, 0);
  const userLevel = getUserLevel(user?.exp ? Math.floor(user.exp) : 0);
  const iconStore: Record<string, JSX.Element> = {
    flag: <FaFlagCheckered className="h-16 w-16" />,
    clock: <IoMdTime className="h-16 w-16" />,
    bulb: <IoBulbOutline className="h-16 w-16" />,
  };
  const [dailyQuizOpen, setDailyQuizOpen] = useState(false);
  const todayDailyQuests =
    dailyQuests && dailyQuests.find((item) => item.userId === user?._id);

  return (
    <div className="flex items-center justify-center ">
      <div className="w-[95%] flex flex-col lg:grid lg:grid-cols-[2fr_5fr] lg:w-[120rem] gap-6 lg:gap-20">
        <div className="flex flex-col text-5xl gap-6 lg:gap-10">
          <div className="flex shadow-xs flex-col justify-center items-center border-neutral-300  bg-white border-1 dark:border-none dark:bg-gradient-to-br dark:from-neutral-900/80 dark:via-neutral-900/87 dark:to-neutral-900/92 rounded-3xl px-10 py-6 h-[23rem] lg:h-[30rem] relative">
            <img
              src={`/avatars/AV${user?.avatar}.png`}
              className="w-34 h-34 rounded-full border-2 border-indigo-500 mb-4"
            />
            <h1 className="text-5xl pt-5 mb-3">{user?.name}</h1>
            <p className="text-neutral-500 dark:text-neutral-300 text-3xl mb-5">
              Welcome back!
            </p>
            <p className="text-neutral-700 dark:text-neutral-200 text-3xl  lg:translate-y-10 -translate-y-2">
              level {userLevel.level}.{" "}
              <FaStar className="inline-block -translate-y-1 text-indigo-500" />{" "}
              {userLevel.levelName} ({userLevel.totalXP} exp)
            </p>
            <p className="absolute bottom-1 text-2xl text-neutral-400">
              Next level in: {userLevel.xpToNextLevel}XP
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 shadow-xs border-neutral-300  bg-white border-1 dark:border-none  dark:bg-neutral-700/70 rounded-2xl px-5 py-9">
            {previousDates.map((date) => (
              <span key={date} className="h-20 w-20 text-center rounded-2xl">
                <span className="block text-4xl pb-4">
                  {user?.streak.includes(date) ? "🔥" : "⚫"}
                </span>
                <span className="block text-neutral-600 dark:text-neutral-300 text-4xl">
                  {date.split("-")[2]}
                </span>
              </span>
            ))}
          </div>

          <div className="bg-white shadow-xs border-1 dark:border-none border-neutral-300  dark:bg-neutral-700/70 rounded-2xl px-5 py-9 text-center">
            <p className=" text-4xl mb-4 dark:text-neutral-100">
              This week you studied for:
            </p>
            <p className="text-5xl underline">{timeSpent} minutes!</p>{" "}
          </div>
          <div className="bg-white shadow-xs border-1 dark:border-none border-neutral-300  dark:bg-neutral-700/70 rounded-2xl px-5 text-center text-4xl py-5 font-semibold cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-200 transition-colors">
            <Link to="/buy-premium" className="group relative">
              <p className="translate-y-2">
                GET
                <LuCrown className="scale-100 group-hover:scale-110 transition inline-block mx-3 w-16 h-16 -translate-y-3 text-indigo-500" />
                PREMIUM!
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col  gap-6 lg:gap-12 ">
          <Link
            to={`/${user?.latestActivity[0]}`}
            className="group relative bg-white shadow-xs border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-12 flex justify-between dark:hover:bg-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            <div className="">
              <p className="text-5xl mb-4">Pick up where you left of: </p>
              <p className="text-4xl">{user?.latestActivity[0]}</p>{" "}
            </div>
            <HiOutlinePlay className="scale-100 group-hover:scale-110 transition text-8xl text-indigo-500" />
          </Link>

          {!dailyQuizOpen &&
          user?.quiz.date !== new Date().toISOString().split("T")[0] ? (
            <div className="bg-white shadow-xs border-neutral-300 border-1 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-8 lg:h-[20rem] flex justify-center items-center gap-8">
              <div
                // onClick={() => handleUpdateDailyQuest("finish quiz")}
                onClick={() => setDailyQuizOpen(true)}
                className="self-center py-20 lg:py-12 pl-12 text-7xl lg:text-9xl h-full w-[30%] border-r-2 border-indigo-500 cursor-pointer"
              >
                GO
              </div>
              <div className="w-[70%] text-5xl">
                Complete short daily quiz to get xp!
              </div>
            </div>
          ) : (
            <DailyQuiz />
          )}

          <div className="bg-white border-1 shadow-xs border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl px-10 py-8 h-[35rem] dark:border-2 dark:border-indigo-500 mb-10">
            <h3 className="text-4xl mb-5 pb-5 text-center border-b-2 border-indigo-500 ">
              Daily Quests:{" "}
              <button onClick={() => handleDeleteDailyQuest()}>delete</button>
            </h3>
            {todayDailyQuests ? (
              <div className=" grid grid-cols-2 gap-y-10">
                <div className="flex flex-col justify-center items-center gap-3 relative">
                  <p>{todayDailyQuests.quest1.title}</p>
                  {iconStore[todayDailyQuests.quest1.icon]}
                  <p>
                    {todayDailyQuests.quest1.progress}/
                    {todayDailyQuests.quest1.toObtain} (
                    {calculatePercent(
                      todayDailyQuests.quest1.progress,
                      todayDailyQuests.quest1.toObtain
                    )}
                    %)
                  </p>
                  {todayDailyQuests.quest1.completed && (
                    <span className="absolute rotate-14  bg-indigo-500/90 px-4 top-20 rounded-lg">
                      COMPLETED
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center gap-3 relative">
                  <p>{todayDailyQuests.quest2.title}</p>
                  {iconStore[todayDailyQuests.quest2.icon]}
                  <p>
                    {todayDailyQuests.quest2.progress}/
                    {todayDailyQuests.quest2.toObtain} (
                    {calculatePercent(
                      todayDailyQuests.quest2.progress,
                      todayDailyQuests.quest2.toObtain
                    )}
                    %)
                  </p>
                  {todayDailyQuests.quest2.completed && (
                    <span className="absolute rotate-14  bg-indigo-500/90 px-4 top-20 rounded-lg">
                      COMPLETED
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center gap-3 relative">
                  <p>{todayDailyQuests.quest3.title}</p>
                  {iconStore[todayDailyQuests.quest3.icon]}

                  <p>
                    {todayDailyQuests.quest3.progress}/
                    {todayDailyQuests.quest3.toObtain} (
                    {calculatePercent(
                      todayDailyQuests.quest3.progress,
                      todayDailyQuests.quest3.toObtain
                    )}
                    %)
                  </p>
                  {todayDailyQuests.quest3.completed && (
                    <span className="absolute rotate-14  bg-indigo-500/90 px-4 top-20 rounded-lg">
                      COMPLETED
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center gap-3 relative">
                  <p>{todayDailyQuests.quest4.title}</p>
                  {iconStore[todayDailyQuests.quest4.icon]}

                  <p>
                    {todayDailyQuests.quest4.progress}/
                    {todayDailyQuests.quest4.toObtain} (
                    {calculatePercent(
                      todayDailyQuests.quest4.progress,
                      todayDailyQuests.quest4.toObtain
                    )}
                    %)
                  </p>
                  {todayDailyQuests.quest4.completed && (
                    <span className="absolute rotate-14  bg-indigo-500/90 px-4 top-20 rounded-lg">
                      COMPLETED
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
