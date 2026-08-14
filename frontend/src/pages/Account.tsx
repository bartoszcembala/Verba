import { calculateStreak } from "../lib/calculateStreak";
import { Link } from "react-router-dom";
import { LuBrain, LuCrown, LuCalendarDays, LuMail, LuUserPlus } from "react-icons/lu";
import { IoSettingsOutline, IoBookOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { FiMinusCircle } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import Modal from "../components/Modal";
import { useCurrentUser, useEditUser } from "../lib/queries/userQueries";
import toast from "react-hot-toast";
import { getLastDates } from "../lib/getLastDates";
import { SlFire } from "react-icons/sl";
import ModalReusable from "../components/ModalReusable";
import AvatarSelector from "../components/Account/AvatarSelector";
import { useProgress } from "../lib/queries/progressQueries";
import { getUserLevel } from "../lib/getExpLevels";

function Account() {
  const { progress } = useProgress();
  const { user } = useCurrentUser();
  const filtered = progress?.filter((item) => item.userName === user?.email);
  const { editUser } = useEditUser();
  const streak = user ? calculateStreak(user.streak) : 0;
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dates = user?.timeSpentLearning.map((d) => ({ date: `${d.date.split("-")[2]}-${d.date.split("-")[1]}`, value: d.value })).slice(-14);
  const wordsLearned = filtered?.reduce((acc, curr) => acc + curr.learned.length, 0) ?? 0;
  const lastDates = getLastDates(dates || []);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  if (!user) return null;
  const currentUser = user;

  async function handleDeleteFriend(friendId: string) {
    const friends = currentUser.friends.filter((friend) => friend.friendId !== friendId);
    await editUser({ data: { friends } }, { onSuccess: () => toast.success("Friend removed.") });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await editUser({ data: { name: userName, ...(Number.isFinite(selectedAvatar) && { avatar: String(selectedAvatar) }) } });
      setSettingsOpen(false);
      toast.success("Profile updated.");
    } catch (error) { console.error(error); }
  }

  const level = getUserLevel(Math.floor(user.exp || 0));
  const totalMinutes = user.timeSpentLearning.reduce((sum, day) => sum + day.value, 0);
  const stats = [
    { label: "Lessons", value: user.finishedLessons.length, icon: IoBookOutline },
    { label: "Words", value: wordsLearned, icon: LuBrain },
    { label: "Day streak", value: streak, icon: SlFire },
    { label: "Minutes", value: totalMinutes, icon: LuCalendarDays },
  ];

  return (
    <div className="mx-auto max-w-[108rem]">
      <header className="mb-10 flex items-center justify-between">
        <div><p className="text-[1.3rem] text-neutral-500">Your profile</p><h1 className="mt-1 text-[3.2rem] font-bold tracking-tight">Account</h1></div>
        <button onClick={() => { setUserName(user.name); setSelectedAvatar(+user.avatar); setSettingsOpen(true); }} className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-[1.35rem] font-semibold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"><IoSettingsOutline /> Edit profile</button>
      </header>

      <section className="border-y border-neutral-200 py-8 dark:border-neutral-800">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
          <img src={`/avatars/AV${user.avatar}.png`} className="h-36 w-36 rounded-full border border-neutral-200 object-cover dark:border-neutral-700" alt={`${user.name}'s avatar`} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-[3rem] font-bold tracking-tight">{user.name}</h2>{user.premium && <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[1.15rem] font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-300"><LuCrown /> Premium</span>}</div>
            <p className="mt-2 flex items-center gap-2 truncate text-[1.4rem] text-neutral-500"><LuMail /> {user.email}</p>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[1.35rem]"><span><strong>Level {level.level}</strong> · {level.levelName}</span><span className="text-neutral-500">{Math.round(user.exp)} XP</span><span className="text-neutral-500">{user.friends.length} friends</span></div>
          </div>
          {!user.premium && <Link to="/buy-premium" className="self-start text-[1.3rem] font-semibold text-indigo-600 hover:underline dark:text-indigo-400">View Premium</Link>}
        </div>
      </section>

      <section className="grid grid-cols-2 border-b border-neutral-200 py-7 dark:border-neutral-800 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, index) => <div key={label} className={`flex items-center gap-4 px-4 py-3 first:pl-0 sm:py-0 ${index > 0 ? "sm:border-l sm:border-neutral-200 sm:dark:border-neutral-800" : ""}`}><Icon className="h-8 w-8 text-neutral-400"/><div><strong className="block text-[2.1rem] leading-none">{value}</strong><span className="mt-1 block text-[1.2rem] text-neutral-500">{label}</span></div></div>)}
      </section>

      <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_30rem]">
        <section>
          <div className="mb-5"><h2 className="text-[2rem] font-semibold">Learning activity</h2><p className="mt-1 text-[1.3rem] text-neutral-500">Minutes studied over the last two weeks</p></div>
          <div className="h-[29rem]"><ResponsiveContainer width="100%" height="100%"><BarChart data={lastDates} margin={{ left: -20, right: 5 }}><XAxis dataKey="date" fontSize={11} axisLine={false} tickLine={false}/><YAxis fontSize={11} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/><Bar dataKey="value" fill="#4f46e5" radius={[3,3,0,0]}/><CartesianGrid vertical={false} stroke="#73737325"/></BarChart></ResponsiveContainer></div>
        </section>

        <aside className="border-t border-neutral-200 pt-7 dark:border-neutral-800 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-[2rem] font-semibold">Friends</h2><p className="mt-1 text-[1.3rem] text-neutral-500">People you follow</p></div><button onClick={() => setIsOpen(true)} className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-white" aria-label="Add friend"><LuUserPlus /></button></div>
          {user.friends.length > 0 ? <div className="divide-y divide-neutral-100 dark:divide-neutral-800">{user.friends.slice(0, 6).map((friend) => <div key={friend.friendId} className="group flex items-center gap-3 py-3"><Link to={`/profile/${friend.friendId}`} className="flex min-w-0 flex-1 items-center gap-3"><img src={`/avatars/AV${friend.avatar}.png`} className="h-14 w-14 rounded-full object-cover" alt=""/><span className="truncate text-[1.35rem] font-medium">{friend.name}</span></Link><button onClick={() => handleDeleteFriend(friend.friendId)} className="text-neutral-300 opacity-0 transition group-hover:opacity-100 hover:text-red-600 dark:text-neutral-600" aria-label={`Remove ${friend.name}`}><FiMinusCircle/></button></div>)}</div> : <button onClick={() => setIsOpen(true)} className="w-full rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-[1.35rem] text-neutral-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-neutral-700"><CiCirclePlus className="mx-auto mb-2 h-9 w-9"/>Find your first friend</button>}
        </aside>
      </div>

      {isOpen && <Modal setIsOpen={setIsOpen} isOpen={isOpen} />}
      <ModalReusable isOpen={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="border-b border-neutral-200 px-6 py-5 pr-16 dark:border-neutral-800 sm:px-8 sm:py-6">
            <h2 className="text-[2.2rem] font-semibold">Edit profile</h2>
            <p className="mt-1 text-[1.35rem] text-neutral-500">Update how your profile appears to other learners.</p>
          </div>

          <div className="space-y-7 px-6 py-6 sm:px-8">
            <section className="flex items-center gap-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-950">
              <img src={`/avatars/AV${selectedAvatar ?? user.avatar}.png`} className="h-20 w-20 rounded-full object-cover" alt="Selected avatar preview" />
              <div className="min-w-0"><p className="truncate text-[1.5rem] font-semibold">{userName || user.name}</p><p className="truncate text-[1.25rem] text-neutral-500">{user.email}</p></div>
            </section>

            <div>
              <label htmlFor="profile-name" className="mb-2 block text-[1.3rem] font-semibold">Display name</label>
              <input id="profile-name" className="h-20 w-full rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.45rem] focus:border-indigo-600 dark:border-neutral-700" value={userName} onChange={(e) => setUserName(e.currentTarget.value)}/>
              <p className="mt-2 text-[1.2rem] text-neutral-500">This name is visible on your profile and leaderboard.</p>
            </div>

            <div>
              <label htmlFor="profile-email" className="mb-2 block text-[1.3rem] font-semibold">Email address</label>
              <input id="profile-email" className="h-20 w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 px-4 text-[1.45rem] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950" value={user.email} disabled/>
              <p className="mt-2 text-[1.2rem] text-neutral-500">Your email cannot be changed here.</p>
            </div>

            <fieldset>
              <legend className="mb-3 text-[1.3rem] font-semibold">Choose an avatar</legend>
              <AvatarSelector selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar}/>
            </fieldset>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950 sm:px-8">
            <button type="button" onClick={() => setSettingsOpen(false)} className="rounded-lg border border-neutral-300 px-5 py-2.5 text-[1.35rem] font-semibold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-[1.35rem] font-semibold text-white hover:bg-indigo-700">Save changes</button>
          </div>
        </form>
      </ModalReusable>
    </div>
  );
}

export default Account;
