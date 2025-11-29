import { getUserLevel } from "../lib/getExpLevels";
import { levels } from "../lib/getExpLevels";
import { User } from "../types";
import { calculatePercent } from "../lib/calculatePercent";

export default function XpGuide() {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userLevel = getUserLevel(user?.exp ? Math.floor(user.exp) : 0);
  const prevLevel = levels[userLevel.level - 1].xp;
  const diff = levels[userLevel.level].xp - prevLevel;
  const toGo = diff - userLevel.xpToNextLevel!;
  const percent = calculatePercent(toGo, diff);
  console.log(percent);
  return (
    <div className="flex items-center justify-center">
      <div className="w-[50%] border-1 mt-12 border-indigo-500 shadow-[0_0_100px_rgba(99,102,241,0.2)] rounded-3xl px-10  py-20">
        <h2 className="text-center font-bold text-5xl pb-8">
          {userLevel.levelName}
        </h2>
        <div className="flex gap-4 mb-20">
          <p>{userLevel.totalXP}XP</p>
          <div className="bg-indigo-200 text-center mb-10 rounded-xl w-full">
            <span className="fixed">{percent}%</span>
            <div
              className="bg-indigo-500 h-12 rounded-xl"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p>{userLevel.nextLevelXP}XP</p>
        </div>
        <div className="bg-neutral-800 rounded-3xl text-center py-10 tracking-wide w-[80%] mx-auto mb-10">
          <h2 className="font-bold text-4xl mb-8">
            📘 New Word Learned — +1 XP
          </h2>
          <p>Every time you learn a new word, you gain experience points.</p>
          <p>This rewards consistency and vocabulary growth.</p>
        </div>
        <div className="bg-neutral-800 rounded-3xl text-center py-10  tracking-wide w-[80%] mx-auto mb-10">
          <h2 className="font-bold text-4xl mb-8">
            📝 Daily Quiz Completed — +3 XP
          </h2>
          <p>Finishing the daily quiz gives you a solid XP boost.</p>
          <p>Quizzes help reinforce learning and test your memory.</p>
        </div>
        <div className="bg-neutral-800 rounded-3xl text-center py-10  tracking-wide w-[80%] mx-auto mb-10">
          <h2 className="font-bold text-4xl mb-8">
            🏆 Quest Completed — +5 XP
          </h2>
          <p>
            Completing one of your daily quests grants the highest amount of XP.
          </p>
          <p>Quests push you to stay active and reach your learning goals.</p>
        </div>
      </div>
    </div>
  );
}
