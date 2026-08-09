import Spinner from "../components/Spinner";
import { useUsers } from "../lib/queries/userQueries";
import { BiSolidCrown } from "react-icons/bi";

export default function Leaderboard() {
  const { users, isLoadingUsers } = useUsers();
  const sortedUsers = users ? [...users].sort((a, b) => b.exp - a.exp).slice(0, 10) : [];

  if (isLoadingUsers) return <Spinner />;

  return (
    <div className="mx-auto max-w-[88rem]">
      <header className="mb-10">
        <h1 className="text-[3.4rem] font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-2 text-[1.5rem] text-neutral-500">Top learners ranked by total experience.</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid grid-cols-[5rem_1fr_auto] border-b border-neutral-200 px-5 py-3 text-[1.2rem] font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-800 sm:grid-cols-[7rem_1fr_14rem]">
          <span>Rank</span><span>Learner</span><span className="text-right">Experience</span>
        </div>
        {sortedUsers.map((user, index) => (
          <div key={user._id} className="grid grid-cols-[5rem_1fr_auto] items-center border-b border-neutral-100 px-5 py-4 last:border-0 dark:border-neutral-800 sm:grid-cols-[7rem_1fr_14rem]">
            <span className="text-[1.5rem] font-semibold text-neutral-500">{index < 3 ? <BiSolidCrown className={`h-8 w-8 ${index === 0 ? "text-amber-500" : index === 1 ? "text-neutral-400" : "text-orange-600"}`} /> : `#${index + 1}`}</span>
            <div className="flex min-w-0 items-center gap-4">
              <img src={`/avatars/AV${user.avatar}.png`} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <span className="truncate text-[1.55rem] font-medium">{user.name}</span>
            </div>
            <span className="text-right text-[1.45rem] font-semibold">{Math.round(user.exp)} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
