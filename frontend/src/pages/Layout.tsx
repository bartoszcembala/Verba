import { Link, Outlet } from "react-router-dom";
import { AccountCtx } from "../lib/AccountContext";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SettingsContext } from "../lib/contexts";
import { useQueryClient } from "@tanstack/react-query";
import { useEditUser, useLogout } from "../lib/queries/userQueries";
import { useDailyStudyTimer } from "../components/useDailyStudyTimer";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { CiSquarePlus } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaRegMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { useGetDailyQuests } from "../lib/queries/dailyQuestsQueries";
import { useUpdateDailyQuests } from "../lib/useUpdateDailyQuests";
import axios from "axios";

type User = {
  _id: string;
  __v: number;
  name: string;
  email: string;
  password: string;
  latestActivity: string[];
  streak: string[];
};

function Layout() {
  const queryClient = useQueryClient();
  const { authorized, setAuthorized, setMode } = useContext(SettingsContext)!;
  const { setAccount } = useContext(AccountCtx)!;
  const { logout } = useLogout();
  const { editUser } = useEditUser();
  const { dailyQuests, refetch } = useGetDailyQuests();
  const { handleDeleteDailyQuest } = useUpdateDailyQuests();

  useDailyStudyTimer();

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const storedUser = localStorage.getItem("user");
  const user: User | undefined = storedUser
    ? (JSON.parse(storedUser) as User)
    : undefined;
  let userDailyQuest =
    dailyQuests && dailyQuests.find((item) => item.userId === user?._id);

  useEffect(() => {
    const userDailyQuest =
      dailyQuests && dailyQuests.find((item) => item.userId === user?._id);

    if (!userDailyQuest) return;

    if (userDailyQuest.day !== new Date().toISOString().split("T")[0]) {
      handleDeleteDailyQuest(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split("T")[0];

      if (!user.streak.includes(today)) {
        const updatedStreak = [...user.streak, today];

        editUser({
          id: user._id,
          data: { streak: updatedStreak },
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            streak: updatedStreak,
          })
        );
      }
    }
  }, [editUser]);

  useEffect(() => {
    setAccount(JSON.parse(localStorage.getItem("account") || "null"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userDailyQuest && user) {
      const data = {
        userId: user._id,
        day: new Date().toISOString().split("T")[0],
        quest1: {
          title: "spend 10 minutes learning",
          progress: 0,
          toObtain: 10,
          completed: false,
          icon: "clock",
        },
        quest2: {
          title: "learn words",
          progress: 0,
          toObtain: 5,
          completed: false,
          icon: "bulb",
        },
        quest3: {
          title: "finish quiz",
          progress: 0,
          toObtain: 1,
          completed: false,
          icon: "flag",
        },
        quest4: {
          title: "finish lesson",
          progress: 0,
          toObtain: 1,
          completed: false,
          icon: "flag",
        },
      };

      axios.post("http://localhost:5000/api/daily-quests/", data);

      refetch();
    }
  }, []);

  async function handleLogout() {
    logout();
    queryClient.clear();
    localStorage.removeItem("user");
    setMode("guest");
    setAuthorized(false);
    toast(
      "You are in guest mode.\n To use all features and save your progress between devices, please log in.",
      {
        duration: 1000,
      }
    );
  }

  return (
    <>
      <Toaster />
      <nav className="flex justify-between items-center  uppercase  px-6 mb-8 dark:border-b-2 dark:border-indigo-500 font-semibold tracking-wide bg-white dark:bg-[#171717]">
        <div className="flex text-3xl">
          <Link
            to="/"
            className="group relative dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4"
          >
            {/* <IoHomeOutline className="w-10 h-10 text-indigo-500" /> */}
            <IoHome className="w-10 h-10 scale-100 group-hover:scale-110 transition" />
            <p className="translate-y-0.5">Home</p>
          </Link>
          <Link
            to="/lessons"
            className=" group relative dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4"
          >
            <HiOutlineBookOpen className="w-10 h-10 scale-100 group-hover:scale-110 transition" />
            <p className="translate-y-0.5">Lessons</p>
          </Link>{" "}
          <Link
            to="/exercises"
            className="group relative dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4"
          >
            <GoPencil className="w-10 h-10 scale-100 group-hover:scale-110 transition" />
            <p className="translate-y-0.5">Exercises</p>
          </Link>
          {/* <Link
            to="/add-module"
            className="dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4"
          >
            <CiSquarePlus className="w-10 h-10 " />
            <p className="translate-y-0.5">Add Module</p>
          </Link> */}
          <div className="relative group inline-block ">
            {/* Główny przycisk */}
            <button className="dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4 cursor-pointer">
              MORE
            </button>

            {/* Menu rozwijane */}
            <div className="absolute -left-8 mt-2 w-70 dark:bg-neutral-800 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-300 z-50 -translate-y-4">
              <Link
                to="/add-module"
                className="block px-6 py-3 text-neutral-700 dark:text-white dark:hover:bg-neutral-700 hover:bg-gray-100"
              >
                Leaderboard
              </Link>
              <Link
                to=""
                className="block px-6 py-3 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white hover:bg-gray-100"
              >
                XP Guide
              </Link>
              <Link
                to=""
                className="block px-6 py-3 dark:hover:bg-neutral-700 text-neutral-700 dark:text-white hover:bg-gray-100"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div
            className="dark:hover:bg-neutral-800 hover:bg-neutral-200/70 cursor-pointer  py-5 px-6 transition-colors rounded-full"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? (
              <FiSun className=" w-10 h-10 " />
            ) : (
              <FaRegMoon className=" w-10 h-10" />
            )}
          </div>
          {!authorized ? (
            <Link
              to="/login"
              className="dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors"
            >
              Log in
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors uppercase cursor-pointer flex justify-center items-center gap-4"
            >
              <p>Log out</p>
              <FaArrowRightFromBracket />
            </button>
          )}
          <Link
            to="/account"
            className="group relative dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4"
          >
            <p>{user ? user.name : "Guest"}</p>
            <FaRegUser className="scale-100 group-hover:scale-110 transition" />
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Layout;
