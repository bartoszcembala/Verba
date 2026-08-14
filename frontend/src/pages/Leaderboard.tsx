import Spinner from "../components/Spinner";
import { useCurrentUser, useUsers } from "../lib/queries/userQueries";
import { BiSolidCrown } from "react-icons/bi";
import { LuMedal, LuTrendingUp } from "react-icons/lu";

export default function Leaderboard() {
  const { users, isLoadingUsers } = useUsers();
  const { user: currentUser } = useCurrentUser();
  const sortedUsers = users
    ? [...users].sort((a, b) => b.exp - a.exp).slice(0, 10)
    : [];
  const topThree = sortedUsers.slice(0, 3);
  const remaining = sortedUsers.slice(3);
  const currentUserId = currentUser?._id;

  if (isLoadingUsers) return <Spinner />;

  const medalStyles = [
    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  ];

  return (
    <div className="mx-auto max-w-[96rem]">
      <header className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[1.25rem] font-semibold text-indigo-600 dark:text-indigo-400">
            <LuTrendingUp /> Weekly standings
          </p>
          <h1 className="text-[3.4rem] font-bold tracking-tight">Leaderboard</h1>
          <p className="mt-2 text-[1.45rem] text-neutral-500">See who has earned the most experience.</p>
        </div>
        <p className="text-[1.25rem] text-neutral-500">Top 10 learners</p>
      </header>

      <section className="mb-7 grid gap-3 md:grid-cols-3">
        {topThree.map((user, index) => {
          const isCurrentUser = user._id === currentUserId;
          return (
            <div
              key={user._id}
              className={`relative flex items-center gap-4 rounded-xl border bg-white p-5 dark:bg-neutral-900 ${
                index === 0
                  ? "border-amber-300 dark:border-amber-800"
                  : isCurrentUser
                    ? "border-indigo-300 dark:border-indigo-700"
                    : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <span className={`absolute -top-3 left-4 grid h-10 min-w-10 place-items-center rounded-full px-2 text-[1.2rem] font-bold ${medalStyles[index]}`}>
                {index === 0 ? <BiSolidCrown className="h-6 w-6" /> : index + 1}
              </span>
              <img src={`/avatars/AV${user.avatar}.png`} alt="" className="h-24 w-24 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-[1.55rem] font-semibold">{user.name}</h2>
                  {isCurrentUser && <span className="rounded bg-indigo-50 px-2 py-0.5 text-[1rem] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">You</span>}
                </div>
                <p className="mt-1 text-[1.3rem] font-semibold text-neutral-500">{Math.round(user.exp)} XP</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid grid-cols-[5rem_1fr_auto] border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[1.1rem] font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 sm:grid-cols-[7rem_1fr_14rem]">
          <span>Rank</span>
          <span>Learner</span>
          <span className="text-right">Experience</span>
        </div>

        {remaining.length > 0 ? remaining.map((user, index) => {
          const rank = index + 4;
          const isCurrentUser = user._id === currentUserId;
          return (
            <div
              key={user._id}
              className={`grid grid-cols-[5rem_1fr_auto] items-center border-b border-neutral-100 px-5 py-4 last:border-0 dark:border-neutral-800 sm:grid-cols-[7rem_1fr_14rem] ${isCurrentUser ? "bg-indigo-50/60 dark:bg-indigo-950/20" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"}`}
            >
              <span className="text-[1.35rem] font-semibold text-neutral-400">{rank}</span>
              <div className="flex min-w-0 items-center gap-4">
                <img src={`/avatars/AV${user.avatar}.png`} alt="" className="h-14 w-14 rounded-full object-cover" />
                <span className="truncate text-[1.45rem] font-medium">{user.name}</span>
                {isCurrentUser && <span className="rounded bg-indigo-100 px-2 py-0.5 text-[1rem] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">You</span>}
              </div>
              <span className="text-right text-[1.4rem] font-semibold">{Math.round(user.exp)} XP</span>
            </div>
          );
        }) : (
          <div className="px-5 py-10 text-center text-[1.35rem] text-neutral-500">
            <LuMedal className="mx-auto mb-3 h-9 w-9" /> More rankings will appear here.
          </div>
        )}
      </section>
    </div>
  );
}
