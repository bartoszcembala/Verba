import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SettingsContext } from "../lib/contexts";
import { useEditUser, useLogout } from "../lib/queries/userQueries";
import { useDailyStudyTimer } from "../components/useDailyStudyTimer";
import { IoHome, IoClipboardOutline } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { GoPencil } from "react-icons/go";
import { FaArrowRightFromBracket, FaGithub } from "react-icons/fa6";
import { FaRegMoon } from "react-icons/fa";
import { FiSun, FiMenu, FiX, FiUser } from "react-icons/fi";
import { LuBook, LuCrown } from "react-icons/lu";

type User = {
  _id: string;
  name: string;
  avatar?: string;
  streak: string[];
};

const navItems = [
  { to: "/", label: "Home", icon: IoHome, end: true },
  { to: "/lessons", label: "Lessons", icon: HiOutlineBookOpen },
  { to: "/exercises", label: "Practice", icon: GoPencil },
  { to: "/leaderboard", label: "Leaderboard", icon: IoClipboardOutline },
];

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authorized, setAuthorized, setMode } = useContext(SettingsContext)!;
  const { logout } = useLogout();
  const { editUser } = useEditUser();
  useDailyStudyTimer();

  useEffect(() => {
    if (!authorized && !localStorage.getItem("user")) navigate("/login");
  }, [authorized, navigate]);

  const storedUser = localStorage.getItem("user");
  const user: User | undefined = storedUser ? JSON.parse(storedUser) : undefined;
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") !== "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!profileOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    if (!user.streak.includes(today)) {
      const updatedStreak = [...user.streak, today];
      editUser({ id: user._id, data: { streak: updatedStreak } });
      localStorage.setItem("user", JSON.stringify({ ...user, streak: updatedStreak }));
    }
  }, [editUser, user?._id]);

  async function handleLogout() {
    logout();
    queryClient.clear();
    localStorage.removeItem("user");
    setMode("guest");
    setAuthorized(false);
    toast.success("You have been logged out.");
    navigate("/login");
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-[1.4rem] font-medium transition-colors ${
      isActive
        ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
        : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster />
      {user && (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 dark:border-neutral-800 dark:bg-neutral-950/95">
          <div className="mx-auto flex h-28 max-w-[128rem] items-center justify-between gap-6 px-6 lg:px-10">
            <Link to="/" className="flex items-center gap-3 text-[2.2rem] font-bold tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-[1.7rem] text-white">V</span>
              verba
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={navClass}>
                  <Icon className="h-7 w-7" /> {label}
                </NavLink>
              ))}
              <NavLink to="/xp-guide" className={navClass}>
                <LuBook className="h-7 w-7" /> XP guide
              </NavLink>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/buy-premium"
                className="hidden items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-[1.35rem] font-semibold text-indigo-600 hover:bg-neutral-50 sm:flex dark:border-neutral-800 dark:text-indigo-400 dark:hover:bg-neutral-900"
              >
                <LuCrown /> Premium
              </Link>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg border border-neutral-200 lg:hidden dark:border-neutral-800"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-label="Open profile menu"
                >
                  <img className="h-9 w-9 rounded-md object-cover" src={`/avatars/AV${user.avatar}.png`} alt="" />
                  <span className="hidden text-[1.4rem] font-medium sm:block">{user.name}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-20 w-72 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                    <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-[1.4rem] hover:bg-neutral-100 dark:hover:bg-neutral-800" to="/account" onClick={() => setProfileOpen(false)}>
                      <FiUser /> Account
                    </Link>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[1.4rem] hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={() => setDarkMode((mode) => !mode)}>
                      {darkMode ? <FiSun /> : <FaRegMoon />} {darkMode ? "Light mode" : "Dark mode"}
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[1.4rem] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={handleLogout}>
                      <FaArrowRightFromBracket /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="mx-6 mb-4 grid gap-1 border-t border-neutral-200 pt-3 dark:border-neutral-800" aria-label="Mobile navigation">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={navClass} onClick={() => setMobileMenuOpen(false)}>
                  <Icon /> {label}
                </NavLink>
              ))}
            </nav>
          )}
        </header>
      )}

      <main className={user ? "w-full flex-1 px-6 py-10 lg:px-10 lg:py-14" : "flex-1"}>
        <Outlet />
      </main>

      {user && (
        <footer className="mx-auto flex w-full max-w-[128rem] items-center justify-between border-t border-neutral-200 px-6 py-8 text-[1.3rem] text-neutral-500 dark:border-neutral-800">
          <span>Verba · Learn a little every day</span>
          <a className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white" href="https://github.com/bartoszcembala/Verba" target="_blank" rel="noopener noreferrer">
            <FaGithub /> GitHub
          </a>
        </footer>
      )}
    </div>
  );
}

export default Layout;
