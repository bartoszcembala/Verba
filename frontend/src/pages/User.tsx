import { Link, useParams } from "react-router-dom";
import { useUser } from "../lib/queries/userQueries";
import { LuCrown } from "react-icons/lu";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calculateStreak } from "../lib/calculateStreak";
import Spinner from "../components/Spinner";

function User() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoadingUser } = useUser(userId || "");
  if (isLoadingUser || !user) return <Spinner />;
  const dates = user.timeSpentLearning.map((d) => ({ date: `${d.date.split("-")[2]}-${d.date.split("-")[1]}`, value: d.value })).slice(-14);
  const streak = calculateStreak(user.streak);
  const stats = [{ label: "Lessons finished", value: user.finishedLessons.length }, { label: "Words learned", value: "—" }, { label: "Day streak", value: streak }];
  return <div className="mx-auto max-w-[96rem] space-y-6">
    <section className="flex items-center gap-5 rounded-xl border border-neutral-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900"><img src={`/avatars/AV${user.avatar}.png`} className="h-28 w-28 rounded-xl object-cover" alt=""/><div><h1 className="text-[3rem] font-bold">{user.name}</h1><p className="mt-1 flex items-center gap-2 text-[1.35rem] text-neutral-500"><LuCrown/>{user.premium ? "Premium member" : "Verba learner"}</p></div></section>
    <div className="grid gap-3 sm:grid-cols-3">{stats.map((stat) => <section key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><strong className="block text-[2.5rem]">{stat.value}</strong><span className="text-[1.25rem] text-neutral-500">{stat.label}</span></section>)}</div>
    <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"><h2 className="mb-5 text-[1.8rem] font-semibold">Study time</h2><div className="h-[25rem]"><ResponsiveContainer width="100%" height="100%"><BarChart data={dates}><XAxis dataKey="date" fontSize={12}/><YAxis fontSize={12}/><Tooltip/><Bar dataKey="value" fill="#4f46e5" radius={[4,4,0,0]}/><CartesianGrid vertical={false} stroke="#73737330"/></BarChart></ResponsiveContainer></div></section>
    <section><h2 className="mb-4 text-[2rem] font-semibold">Friends</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">{user.friends.map((friend) => <Link key={friend.friendId} to={`/profile/${friend.friendId}`} className="rounded-xl border border-neutral-200 bg-white p-4 text-center dark:border-neutral-800 dark:bg-neutral-900"><img src={`/avatars/AV${friend.avatar}.png`} className="mx-auto h-20 w-20 rounded-lg object-cover" alt=""/><span className="mt-3 block truncate text-[1.35rem] font-medium">{friend.name}</span></Link>)}</div></section>
  </div>;
}

export default User;
