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
          })
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
                  <IoArrowUpCircleOutline className="w-10 h-10 scale-100 group-hover:scale-110 transition group-hover:rotate-180 duration-250" />
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

            {/* Actions (darkmode, login/logout) */}
            <div className="hidden lg:flex justify-center items-center">
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
              {!user ? (
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
    </>
  );
}

export default Layout;
