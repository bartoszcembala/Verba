import { calculateStreak } from "../lib/calculateStreak";
import { Link } from "react-router-dom";
import { User } from "../types";
import { LuCrown } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { FiMinusCircle } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import Modal from "../components/Modal";
import { useEditUser } from "../lib/queries/userQueries";
import toast from "react-hot-toast";
import { getLastDates } from "../lib/getLastDates";
import { IoBookOutline } from "react-icons/io5";
import { LuBrain } from "react-icons/lu";
import { SlFire } from "react-icons/sl";
import ModalReusable from "../components/ModalReusable";
import axios from "axios";
import AvatarSelector from "../components/Account/AvatarSelector";

function Account() {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const { editUser } = useEditUser();
  const streak = user && calculateStreak(user.streak);
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userName, setUserName] = useState(user?.name || "");
  const dates = user?.timeSpentLearning
    .map((d) => ({
      date: `${d.date.split("-")[2]}-${d.date.split("-")[1]}`,
      value: d.value,
    }))
    .slice(-14);

  // Delete friend
  function handleDelteFriend(friendId: string) {
    const filteredFriends = user?.friends.filter(
      (friend) => friend.friendId !== friendId
    );
    editUser(
      {
        id: user!._id,
        data: {
          friends: [...(filteredFriends || [])],
        },
      },
      {
        onSuccess: () => {
          toast.success("Friend removed successfully!");
        },
      }
    );
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        friends: [...(filteredFriends || [])],
      })
    );
  }

  const lastDates = getLastDates(dates || []);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(
    +user!.avatar || null
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      axios.patch(`http://localhost:5000/api/users/${user?._id}`, {
        name: userName,
        ...(Number.isFinite(selectedAvatar) && { avatar: selectedAvatar }),
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          name: userName,
          ...(Number.isFinite(selectedAvatar) && { avatar: selectedAvatar }),
        })
      );
      setSettingsOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center items-center ">
      <div className="w-[95%] lg:w-[90rem] flex flex-col  gap-6 lg:gap-8">
        <>
          {/* Profile */}
          <div className="rounded-3xl bg-white border-1 dark:border-none border-neutral-300 dark:bg-gradient-to-br dark:from-neutral-900/80 dark:via-neutral-900/86 dark:to-neutral-900/92 py-10 px-12 lg:py-14  lg:px-20 relative">
            <div className="flex gap-20 items-center">
              <img
                src={`/avatars/AV${user!.avatar}.png`}
                className="w-46 h-46 rounded-full border-2 border-indigo-500"
              />
              <div>
                <h1 className="text-7xl lg:text-8xl  pb-3">{user!.name} </h1>{" "}
                <Link
                  to="/buy-premium"
                  className="text-neutral-400 cursor-pointer"
                >
                  {user!.premium ? "Premium user" : "Get a premium membership!"}{" "}
                  <LuCrown className="inline-block text-indigo-500 -translate-y-0.5 ml-1" />
                </Link>
              </div>
              <IoSettingsOutline
                className="absolute right-10 top-10 h-12 w-12 cursor-pointer hover:rotate-45 transition duration-280"
                onClick={() => setSettingsOpen(true)}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="border-1 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] px-2 py-4 lg:p-10 bg-white   dark:bg-neutral-700/70 rounded-3xl flex flex-col items-center justify-center gap-4">
              <p className="text-center leading-9 text-3xl lg:text-4xl">
                FINSHED LESSONS:
              </p>
              <div className="text-5xl lg:text-7xl flex items-center gap-4">
                <p>{user!.finishedLessons.length}</p>
                <IoBookOutline className="translate-y-1" />
              </div>
            </div>
            <div className="border-1 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] px-2 py-4 lg:p-10 bg-white  dark:bg-neutral-700/70 rounded-3xl flex flex-col items-center justify-center gap-4">
              <p className="text-center leading-9 text-3xl lg:text-4xl">
                WODS LEARNED:
              </p>
              <div className="text-5xl lg:text-7xl flex items-center gap-4">
                <p>238</p>
                <LuBrain />
              </div>
            </div>{" "}
            <div className="border-1 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] px-2 py-4 lg:p-10 bg-white  dark:bg-neutral-700/70 rounded-3xl flex flex-col items-center justify-center gap-4">
              <p className="text-center leading-9 text-3xl lg:text-4xl">
                STREAK:
              </p>
              <div className="text-5xl lg:text-7xl flex items-center gap-4">
                <p>{streak} DAYS</p>
                <SlFire />
              </div>
            </div>
          </div>

          {/* Graph */}
          <div className="w-full h-[26rem] flex items-center justify-center pt-12 pb-4 pr-14 mx-auto bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={730} height={250} data={lastDates}>
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

          {/* Friends list */}
          <div className="grid-cols-3  grid lg:grid-cols-5  justify-center items-center gap-6 ">
            {user!.friends.map((friend) => (
              <div
                key={friend.friendId}
                className="flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl text-center h-[16rem] relative"
              >
                <div className="flex absolute top-5 justify-between w-[14rem]">
                  {/* <TbHandFingerRight className="cursor-pointer" /> */}
                  <span></span>
                  <FiMinusCircle
                    className="cursor-pointer"
                    onClick={() => handleDelteFriend(friend.friendId)}
                  />
                </div>
                <Link to={`/profile/${friend.friendId}`}>
                  <img
                    src={`/avatars/AV${friend.avatar}.png`}
                    alt="profile picture"
                    className="w-24 h-24 border-2 border-indigo-500 rounded-full"
                  />
                </Link>
                <Link to={`/profile/${friend.friendId}`} className="leading-9">
                  {friend.name}
                </Link>
              </div>
            ))}

            {Array.from({ length: 5 - user!.friends.length }).map(
              (_, index) => (
                <div
                  onClick={() => setIsOpen(true)}
                  key={index}
                  className="hover:bg-neutral-200 dark:hover:bg-neutral-700 group transition flex flex-col gap-4 justify-center items-center px-7 py-5 bg-white border-1 border-neutral-300 dark:border-none dark:bg-neutral-700/70 rounded-3xl text-center h-[16rem] cursor-pointer"
                >
                  <CiCirclePlus className="text-neutral-600 dark:text-white transition w-24 h-24 scale-100 group-hover:scale-110" />
                  <p>Add friend</p>
                </div>
              )
            )}

            {/* Modal */}
            {isOpen && <Modal setIsOpen={setIsOpen} isOpen={isOpen} />}
            <ModalReusable
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            >
              <div>
                <h1 className="text-6xl font-bold">Settings</h1>
                <form className="px-6 my-20">
                  <p>Name</p>
                  <input
                    className="w-full  shadow-[0_0_10px_rgba(93,93,93,0.3)] bg-neutral-700 px-4 py-2 rounded-2xl mb-5"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.currentTarget.value)}
                  />

                  <p>Email</p>
                  <input
                    className=" w-full  shadow-[0_0_10px_rgba(93,93,93,0.3)] bg-neutral-700 px-4 py-2 rounded-2xl cursor-not-allowed mb-5"
                    type="text"
                    value={user?.email}
                    disabled={true}
                  />

                  <p>Avatar</p>
                  <AvatarSelector
                    selectedAvatar={selectedAvatar}
                    setSelectedAvatar={setSelectedAvatar}
                  />

                  <button
                    onClick={handleSubmit}
                    className="border-1 border-indigo-500 h-20 shadow-[0_0_10px_rgba(99,102,241,0.3)]  w-full cursor-pointer px-4 py-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 hover:scale-102 transition"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </ModalReusable>
          </div>
        </>
      </div>
    </div>
  );
}

export default Account;
