import { Link, useParams } from "react-router-dom";
import { useUser } from "../lib/queries/userQueries";
import { LuCrown } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calculateStreak } from "../lib/calculateStreak";
import { RxAvatar } from "react-icons/rx";

function User() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoadingUser } = useUser(userId || "");
  const dates = user?.timeSpentLearning
    .map((d) => ({
      date: `${d.date.split("-")[2]}-${d.date.split("-")[1]}`,
      value: d.value,
    }))
    .slice(-14);
  const streak = user && calculateStreak(user.streak);

  if (isLoadingUser || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center ">
      <div className="w-[90rem] flex flex-col gap-8">
        <>
          <div className="rounded-2xl bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 py-14 px-20">
            <div className="flex gap-20 items-center">
              <img
                src="/avatars/AV9.png"
                className="w-30 h-30 rounded-full border-2 border-indigo-500"
              />
              <div>
                <h1 className="text-8xl  pb-3">{user.name} </h1>{" "}
                <p className="text-neutral-400">
                  {user.premium ? "Premium user" : "Regular user"}{" "}
                  <LuCrown className="inline-block text-indigo-500 -translate-y-0.5 ml-1" />
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-10 bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 rounded-2xl flex flex-col items-center justify-center gap-4">
              <p>FINSHED LESSONS:</p>
              <p className="text-7xl">{user.finishedLessons.length}</p>
            </div>
            <div className="p-10 bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 rounded-2xl flex flex-col items-center justify-center gap-4">
              <p>WODS LEARNED:</p>
              <p className="text-7xl">238</p>
            </div>{" "}
            <div className="p-10 bg-white border-1 dark:border-none border-neutral-300 dark:bg-neutral-700/70 rounded-2xl flex flex-col items-center justify-center gap-4">
              <p>STREAK:</p>
              <p className="text-7xl">{streak} DAYS</p>
            </div>
          </div>

          <div className="w-full h-[26rem] flex items-center justify-center p-10 mx-auto bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={730} height={250} data={dates}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#8a8a8a",
                    borderColor: "#797979",
                  }}
                  cursor={{ fill: "#474747" }}
                />
                <Bar dataKey="value" fill="#6366F1" />
                <CartesianGrid strokeDasharray="0" stroke="#6365f17b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 justify-center items-center gap-6">
            {user.friends.map((friend) => (
              <div
                key={friend.friendId}
                className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl text-center h-[16rem] relative"
              >
                <Link to={`/profile/${friend.friendId}`}>
                  <img
                    src={`/avatars/AV${friend.avatar}.png`}
                    alt="profile picture"
                    className="w-24 h-24 border-2 border-indigo-500 rounded-full"
                  />
                </Link>
                <Link
                  to={`/profile/${friend.friendId}`}
                  className="leading-none"
                >
                  {friend.name}
                </Link>
              </div>
            ))}

            {Array.from({ length: 5 - user.friends.length }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-2xl text-center h-[16rem] cursor-pointer"
              >
                <RxAvatar className="w-34 h-34 opacity-40" />

              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
}

export default User;
