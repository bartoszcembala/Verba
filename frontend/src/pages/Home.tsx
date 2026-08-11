import { Link } from "react-router-dom";
import { User } from "../types";
import { getPreviousDates } from "../lib/getPreviousDates";
import { HiOutlineArrowRight, HiOutlinePlay } from "react-icons/hi2";
import { LuCrown, LuClock3 } from "react-icons/lu";
import { useState } from "react";
import DailyQuiz from "../components/Home/DailyQuiz";
import DailyQuests from "../components/Home/DailyQuests";
import { getUserLevel } from "../lib/getExpLevels";
import { todayInWarsaw } from "../lib/today";

function Home() {
  const previousDates = getPreviousDates(7);
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userLevel = getUserLevel(user?.exp ? Math.floor(user.exp) : 0);
  const timeSpent = user?.timeSpentLearning?.slice(-7).reduce((sum, curr) => sum + curr.value, 0) ?? 0;
  const [dailyQuizOpen, setDailyQuizOpen] = useState(false);
  const today = todayInWarsaw();
  const nextPath = user?.latestActivity?.[0] ? `/${user.latestActivity[0][0]}` : "/lessons";
  const nextLabel = user?.latestActivity?.[0] ? user.latestActivity[0][1] : "Start your first lesson";

  return (
    <div className="mx-auto max-w-[118rem]">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[3.2rem] font-bold tracking-tight sm:text-[4rem]">Welcome back, {user?.name}</h1>
          <p className="mt-2 text-[1.6rem] text-neutral-500 dark:text-neutral-400">Here&apos;s where you left off.</p>
        </div>
        <Link to={nextPath} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-[1.45rem] font-semibold text-white hover:bg-indigo-700">
          <HiOutlinePlay /> Continue learning
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[31rem_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-4">
              <img className="h-24 w-24 rounded-lg object-cover" src={`/avatars/AV${user?.avatar}.png`} alt={`${user?.name}'s avatar`} />
              <div>
                <p className="text-[1.3rem] text-neutral-500">Level {userLevel.level}</p>
                <h2 className="text-[2rem] font-semibold">{userLevel.levelName}</h2>
                <p className="mt-1 text-[1.3rem] text-neutral-500">{Math.round(user?.exp ?? 0)} XP total</p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <span className="block h-full bg-indigo-600" style={{ width: `${Math.max(8, Math.min(100, 100 - userLevel.xpToNextLevel))}%` }} />
            </div>
            <p className="mt-2 text-[1.2rem] text-neutral-500">{userLevel.xpToNextLevel} XP to the next level</p>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-[1.7rem] font-semibold">This week</h2>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {previousDates.map((date) => {
                const active = user?.streak.includes(date) || date === today;
                return (
                  <div className="text-center" key={date}>
                    <span className="block text-[1.15rem] text-neutral-500">{date.split("-")[2]}</span>
                    <span className={`mx-auto mt-2 grid h-8 w-8 place-items-center rounded-full text-[1.1rem] ${active ? "bg-indigo-600 text-white" : "bg-neutral-100 text-transparent dark:bg-neutral-800"}`}>✓</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <LuClock3 className="mb-4 text-indigo-600" />
              <strong className="block text-[2.2rem]">{timeSpent}</strong>
              <span className="text-[1.2rem] text-neutral-500">minutes studied</span>
            </div>
            <Link to="/buy-premium" className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-indigo-300 dark:border-neutral-800 dark:bg-neutral-900">
              <LuCrown className="mb-4 text-indigo-600" />
              <strong className="block text-[1.6rem]">Premium</strong>
              <span className="text-[1.2rem] text-neutral-500">More lessons</span>
            </Link>
          </section>
        </aside>

        <div className="space-y-6">
          <Link to={nextPath} className="group flex items-center gap-5 rounded-xl border border-neutral-200 bg-white p-6 hover:border-indigo-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-700">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"><HiOutlinePlay /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[1.25rem] font-medium text-neutral-500">Continue where you left off</p>
              <h2 className="mt-1 truncate text-[2.1rem] font-semibold">{nextLabel}</h2>
            </div>
            <HiOutlineArrowRight className="h-8 w-8 text-neutral-400 transition-transform group-hover:translate-x-1" />
          </Link>

          {!dailyQuizOpen && user?.quiz.date !== today ? (
            <button className="flex w-full flex-col items-start rounded-xl border border-neutral-200 bg-white p-7 text-left hover:border-indigo-300 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-700" onClick={() => setDailyQuizOpen(true)}>
              <div>
                <p className="text-[1.3rem] font-medium text-indigo-600 dark:text-indigo-400">Daily quiz · 5 questions</p>
                <h2 className="mt-2 text-[2.3rem] font-semibold">Quick vocabulary check</h2>
                <p className="mt-1 text-[1.4rem] text-neutral-500">Complete it today to earn bonus XP.</p>
              </div>
              <span className="mt-5 flex items-center gap-2 text-[1.4rem] font-semibold text-indigo-600 sm:mt-0">Start quiz <HiOutlineArrowRight /></span>
            </button>
          ) : (
            <DailyQuiz />
          )}

          <DailyQuests />
        </div>
      </div>
    </div>
  );
}

export default Home;
