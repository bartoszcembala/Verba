import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SettingsContext } from "../lib/contexts";
import { useQueryClient } from "@tanstack/react-query";
import { useEditUser, useLogout } from "../lib/queries/userQueries";
import { useDailyStudyTimer } from "../components/useDailyStudyTimer";
import { IoHome } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { GoPencil } from "react-icons/go";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaRegMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { FaRegClipboard } from "react-icons/fa6";
import { LuBook } from "react-icons/lu";
import { LuCrown } from "react-icons/lu";

type User = {
  _id: string;
  __v: number;
  name: string;
  email: string;
  password: string;
  latestActivity: string[][];
  streak: string[];
};

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authorized, setAuthorized, setMode, mode } =
    useContext(SettingsContext)!;
  const { logout } = useLogout();
  const { editUser } = useEditUser();
  useDailyStudyTimer();

  // Navigate to login if not authorized
  useEffect(() => {
    !authorized && !localStorage.getItem("user") && navigate("/login");
  }, [authorized]);

  const storedUser = localStorage.getItem("user");
  const user: User | undefined = storedUser
    ? (JSON.parse(storedUser) as User)
    : undefined;

  // Dark mode
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Update user streak
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
          }),
        );
      }
    }
  }, [editUser]);

  // Logout handler
  async function handleLogout() {
    logout();
    queryClient.clear();
    localStorage.removeItem("user");
    setMode("guest");
    setAuthorized(false);
    toast.success("You have been logged out successfully.", {
      duration: 2000,
    });
    navigate("/login");
  }

  return (
    <>
      <Toaster />
      {user && (
        <nav className="relative mb-10">
          <div className="flex justify-between items-center uppercase px-6 mb-8 dark:border-b-2 dark:border-indigo-500 font-semibold tracking-wide bg-white dark:bg-[#171717]">
            {/* Hamburger button */}
            <button
              className="lg:hidden py-6 cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <svg
                className="w-8 h-8 text-gray-800 dark:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex text-3xl">
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
              <div className="relative group inline-block ">
                {/* Główny przycisk */}
                <button className="dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4 cursor-pointer">
                  <IoArrowUpCircleOutline className="w-10 h-10 scale-100 group-hover:scale-110 transition group-hover:rotate-180 duration-250" />
                  MORE
                </button>

                {/* Menu rozwijane */}
                <div className="absolute -left-8 mt-2 w-80 dark:bg-neutral-700 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-300 z-50 -translate-y-4 py-4">
                  <Link
                    to="/leaderboard"
                    className="dark:hover:bg-neutral-600 hover:bg-neutral-200/70 cursor-pointer  transition-colors justify-center items-center flex py-3 gap-4 px-3"
                  >
                    <FaRegClipboard className=" w-10 h-10" />
                    <p>Leaderboard</p>
                  </Link>
                  <Link
                    to="/xp-guide"
                    className="dark:hover:bg-neutral-600 hover:bg-neutral-200/70 cursor-pointer  transition-colors justify-center items-center flex py-3 gap-4 px-3"
                  >
                    <LuBook className=" w-10 h-10" />
                    <p>XP Guide</p>
                  </Link>
                  <Link
                    to="/buy-premium"
                    className="dark:hover:bg-neutral-600 hover:bg-neutral-200/70 cursor-pointer  transition-colors justify-center items-center flex py-3 gap-4 px-3"
                  >
                    <LuCrown className=" w-10 h-10" />
                    <p>Buy Premium</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions (darkmode, login/logout) */}
            <div className="relative group inline-block ">
              {/* Główny przycisk */}
              <button className="dark:hover:bg-neutral-800 hover:bg-neutral-200/70 py-8 px-10 transition-colors flex justify-center items-center gap-4 cursor-pointer">
                <FaRegUser className="scale-100 w-12 h-12 text-indigo-500 group-hover:scale-110 transition" />
              </button>

              {/* Menu rozwijane */}
              <div className="absolute -left-50 mt-2 w-80 dark:bg-neutral-700 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto py-4 transition duration-300 z-50 -translate-y-4">
                <Link
                  to="/account"
                  className="dark:hover:bg-neutral-600 hover:bg-neutral-200/70 cursor-pointer  transition-colors justify-center items-center flex py-2 gap-4 px-3"
                >
                  <FaRegUser />
                  <p>Account</p>
                </Link>

                <div
                  className="dark:hover:bg-neutral-600 hover:bg-neutral-200/70 cursor-pointer  transition-colors justify-center items-center flex py-2 gap-4 px-3"
                  onClick={() => setDarkMode((prev) => !prev)}
                >
                  {darkMode ? (
                    <>
                      <FiSun className=" w-10 h-10 " />
                      <p>Light Mode</p>
                    </>
                  ) : (
                    <>
                      <FaRegMoon className=" w-10 h-10" />
                      <p>Dark Mode</p>
                    </>
                  )}
                </div>
                <div
                  className="dark:hover:bg-neutral-600 hover:bg-neutral-200/70 cursor-pointer  transition-colors justify-center items-center gap-4 flex py-2 "
                  onClick={handleLogout}
                >
                  <FaArrowRightFromBracket />
                  <p>Log out</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile nav - dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden flex flex-col gap-1 px-6 pb-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
              >
                Home
              </Link>
              <Link
                to="/lessons"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
              >
                Lessons
              </Link>
              <Link
                to="/exercises"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
              >
                Exercises
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
              >
                {user ? user.name : "Guest"}
              </Link>
              {authorized ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="py-2 px-4 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md text-left"
                >
                  Log out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md"
                >
                  Log in
                </Link>
              )}
              <button
                className="py-2 px-4 flex items-center gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-800  cursor-pointer rounded-md"
                onClick={() => {
                  setDarkMode((prev) => !prev);
                  setMobileMenuOpen(false);
                }}
              >
                {darkMode ? (
                  <FiSun className="w-6 h-6" />
                ) : (
                  <FaRegMoon className="w-6 h-6" />
                )}
                {darkMode ? "Light mode" : "Dark mode"}
              </button>
            </div>
          )}
        </nav>
      )}
      <Outlet />
      <div className="font-bold fixed bottom-0 left-0 right-0 border-t-2 border-neutral-600 dark:border-neutral-700  text-neutral-800 dark:text-neutral-300 bg-neutral-300 dark:bg-neutral-800 text-center text-3xl py-3 tracking-wide">
         App is still in development - some bugs may occur. <span className=" text-indigo-400">v0.1.3-alpha</span>
      </div>
    </>
  );
}

export default Layout;
