/* eslint-disable react/prop-types */
import { Link, Outlet } from "react-router-dom";
import "../App.css";
import { AccountCtx } from "../lib/AccountContext";
import { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { SettingsContext } from "../lib/contexts";

function Layout({ setProgress, setModules, setDbAccount, dbAccount }) {
  const { authorized, setAuthorized, setMode } = useContext(SettingsContext);
  const { setAccount } = useContext(AccountCtx);

  useEffect(() => {
    setAccount((prev) => JSON.parse(localStorage.getItem("account")) || prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    try {
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setMode("guest");
      setProgress("");
      setModules("");
      setDbAccount("");
      setAuthorized(false);
      toast(
        "You are in guest mode.\n To use all features and save your progress between devices, please log in.",
        {
          duration: 1000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Toaster />
      <nav className="navigation">
        <div>
          <Link
            to="/"
            className="hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400 py-5 px-10 uppercase text-4xl font-bold text-white rounded-2xl mr-5"
          >
            Home
          </Link>
          <Link
            to="/lesson"
            className="hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400 py-5 px-10 uppercase text-4xl font-bold text-white rounded-2xl mr-5"
          >
            Lessons
          </Link>
          <Link
            to="/addmodule"
            className="hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400 py-5 px-10 uppercase text-4xl font-bold text-white rounded-2xl "
          >
            Add Module
          </Link>
        </div>
        <div>
          {!authorized ? (
            <Link
              to="/login"
              className="hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400 py-5 px-10 uppercase text-4xl font-bold text-white rounded-2xl ml-5"
            >
              Log in
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400 py-5 px-10 uppercase text-4xl font-bold text-white rounded-2xl ml-5"
            >
              Log out
            </button>
          )}
          <Link
            to="/account"
            className="hover:bg-neutral-800 transition duration-200 border-1 border-solid border-neutral-400 py-5 px-10 uppercase text-4xl font-bold text-white rounded-2xl ml-5"
          >
            {dbAccount ? dbAccount.name : "GuesT"}
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Layout;
