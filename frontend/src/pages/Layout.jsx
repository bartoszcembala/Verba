/* eslint-disable react/prop-types */
import { Link, Outlet } from "react-router-dom";
import "../App.css";
import { AccountCtx } from "../lib/AccountContext";
import { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function Layout({
  setProgress,
  setModules,
  setLogged,
  logged,
  setAuthorized,
  setDbAccount,
  dbAccount,
  setMode,
}) {
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
      setLogged(false);
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
          <Link to="/" className="navBtn btn">
            Home
          </Link>
          <Link to="/lesson" className="navBtn btn">
            Lessons
          </Link>
          <Link to="/addmodule" className="navBtn btn">
            Add Module
          </Link>
        </div>
        <div>
          {!logged ? (
            <Link to="/login" className="navBtn btn">
              Log in
            </Link>
          ) : (
            <button onClick={handleLogout} className="navBtn btn">
              Log out
            </button>
          )}
          <Link to="/account" className="navBtn btn">
            {dbAccount ? dbAccount.name : "GuesT"}
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Layout;
