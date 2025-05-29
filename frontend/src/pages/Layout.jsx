/* eslint-disable react/prop-types */
import { Link, Outlet } from "react-router-dom";
import "../App.css";
import { AccountCtx } from "../lib/AccountContext";
import { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SettingsContext, UserContext } from "../lib/contexts";
import { useQueryClient } from "@tanstack/react-query";
import { useEditUser, useLogout } from "../lib/queries";
import { btn } from "../lib/styles";

function Layout() {
  const { user, setUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { authorized, setAuthorized, setMode } = useContext(SettingsContext);
  const { setAccount } = useContext(AccountCtx);
  const { logout } = useLogout();
  const { editUser } = useEditUser();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(new Date().toISOString().split("T")[0], user);
    if (!user.streak.includes(new Date().toISOString().split("T")[0])) {
      editUser({
        id: user._id,
        data: {
          streak: [...user.streak, new Date().toISOString().split("T")[0]],
        },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          streak: [...user.streak, new Date().toISOString().split("T")[0]],
        })
      );
    }
  }, [editUser]);

  useEffect(() => {
    setAccount((prev) => JSON.parse(localStorage.getItem("account")) || prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    logout();
    queryClient.clear();
    localStorage.removeItem("user");
    setUser(null);
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
