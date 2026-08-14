import { getUserLevel, levels } from "../lib/getExpLevels";
import { calculatePercent } from "../lib/calculatePercent";
import { calculateStreak } from "../lib/calculateStreak";
import { LuBookOpen, LuCircleCheck, LuTrophy } from "react-icons/lu";
import { useCurrentUser } from "../lib/queries/userQueries";

const waysToEarn = [
  { icon: LuBookOpen, title: "Learn a new word", xp: "+1 XP", text: "Earn experience as you add vocabulary to your learned list." },
  { icon: LuCircleCheck, title: "Complete the daily quiz", xp: "+3 XP", text: "Use the daily review to reinforce words you already know." },
  { icon: LuTrophy, title: "Complete a quest", xp: "+5 XP", text: "Finish daily learning goals to make steady progress." },
];

export default function XpGuide() {
  const { user } = useCurrentUser();
  const userLevel = getUserLevel(user?.exp ? Math.floor(user.exp) : 0);
  const currentIndex = Math.max(0, userLevel.level - 1);
  const prevXP = levels[currentIndex]?.xp ?? 0;
  const nextXP = levels[userLevel.level]?.xp ?? userLevel.nextLevelXP;
  const percent = calculatePercent(Math.max(0, userLevel.totalXP - prevXP), Math.max(1, nextXP - prevXP));
  const streak = user ? calculateStreak(user.streak) : 0;

  return (
    <div className="mx-auto max-w-[104rem]">
      <header className="mb-10">
        <h1 className="text-[3.4rem] font-bold tracking-tight">XP and levels</h1>
        <p className="mt-2 text-[1.5rem] text-neutral-500">See how experience works and what comes next.</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[1fr_30rem]">
        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[1.3rem] text-neutral-500">Level {userLevel.level}</p><h2 className="mt-1 text-[2.6rem] font-semibold">{userLevel.levelName}</h2></div>
              <strong className="text-[1.5rem]">{userLevel.totalXP} XP</strong>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"><span className="block h-full bg-indigo-600" style={{ width: `${Math.min(100, percent)}%` }} /></div>
            <div className="mt-2 flex justify-between text-[1.2rem] text-neutral-500"><span>{prevXP} XP</span><span>{nextXP} XP</span></div>
            <p className="mt-6 border-t border-neutral-100 pt-5 text-[1.4rem] dark:border-neutral-800">Your {streak}-day streak adds a <strong>{streak}% XP multiplier</strong>.</p>
          </section>
          <section>
            <h2 className="mb-4 text-[2rem] font-semibold">Ways to earn XP</h2>
            <div className="space-y-3">
              {waysToEarn.map(({ icon: Icon, title, xp, text }) => (
                <div key={title} className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-neutral-100 text-indigo-600 dark:bg-neutral-800 dark:text-indigo-400"><Icon /></span>
                  <div className="flex-1"><div className="flex justify-between gap-3"><h3 className="text-[1.55rem] font-semibold">{title}</h3><strong className="text-[1.35rem] text-indigo-600 dark:text-indigo-400">{xp}</strong></div><p className="mt-1 text-[1.35rem] text-neutral-500">{text}</p></div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-[1.7rem] font-semibold">Level milestones</h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {levels.map((level) => (
              <div key={level.level} className={`flex items-center justify-between py-3 text-[1.3rem] ${level.level === userLevel.level ? "font-semibold text-indigo-600 dark:text-indigo-400" : ""}`}>
                <span>{level.level}. {level.name}</span><span className="text-neutral-500">{level.xp} XP</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
