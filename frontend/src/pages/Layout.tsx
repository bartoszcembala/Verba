import { Link, Outlet } from "react-router-dom";
import "../App.css";
import { AccountCtx } from "../lib/AccountContext";
import { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SettingsContext } from "../lib/contexts";
import { useQueryClient } from "@tanstack/react-query";
import { useEditUser, useLogout } from "../lib/queries/userQueries";
import { btn } from "../lib/styles";
import { useDailyStudyTimer } from "../components/useDailyStudyTimer";

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
  useDailyStudyTimer();

  const storedUser = localStorage.getItem("user");
  const user: User | undefined = storedUser
    ? (JSON.parse(storedUser) as User)
    : undefined;

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
      <nav className="navigation">
        <div>
          <Link to="/" className={btn + " mr-5"}>
            Home
          </Link>
          <Link to="/lessons" className={btn + " mr-5"}>
            Lessons
          </Link>
          <Link to="/exercises" className={btn + " mr-5"}>
            Exercises
          </Link>
          <Link to="/addmodule" className={btn + " mr-5"}>
            Add Module
          </Link>
        </div>
        <div>
          {!authorized ? (
            <Link to="/login" className={btn + " mr-5"}>
              Log in
            </Link>
          ) : (
            <button onClick={handleLogout} className={btn + " ml-5"}>
              Log out
            </button>
          )}
          <Link to="/account" className={btn + " ml-5"}>
            {user ? user.name : "Guest"}
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Layout;
