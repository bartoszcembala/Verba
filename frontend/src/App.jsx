import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DATA from "./data/verbs";
import AccountContext from "./lib/AccountContext";
import Account from "./pages/Account";
import Layout from "./pages/Layout";
import Exercise from "./components/Exercise";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AddModule from "./pages/AddModule";

function App() {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [dbAccount, setDbAccount] = useState();
  const [authorized, setAuthorized] = useState(false);
  const [logged, setLogged] = useState();
  const [mode, setMode] = useState("guest");

  async function fetchModules() {
    const res = await fetch("http://localhost:5000/api/modules/", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setModules(data.data);
  }

  async function fetchProgress() {
    const res = await fetch("http://localhost:5000/api/progress/", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setProgress(data.data);
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:5000/api/users/check", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setAuthorized(true);
          setLogged(true);
          setMode("user");
          const data = await res.json();
          console.log(data);
          setDbAccount(data);
        } else {
          setMode;
          toast(
            "You are in guest mode.\n To use all features and save your progress between devices, please log in.",
            {
              duration: 1000,
            }
          );
        }
      } catch (error) {
        console.log("Not loged in");
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchModules();
      fetchProgress();
    }
  }, [authorized]);

  return (
    <>
      <Toaster />
      <AccountContext>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  logged={logged}
                  setLogged={setLogged}
                  authorized={authorized}
                  setAuthorized={setAuthorized}
                  setModules={setModules}
                  setProgress={setProgress}
                  setDbAccount={setDbAccount}
                  dbAccount={dbAccount}
                  setMode={setMode}
                />
              }
            >
              <Route
                index
                element={
                  <Home
                    mode={mode}
                    logged={logged}
                    modules={modules}
                    progress={progress}
                  />
                }
              />
              {mode === "user" &&
                logged &&
                modules &&
                progress &&
                authorized &&
                modules.map((module) => (
                  <Route
                    key={module._id}
                    path={`/${module.title}`}
                    element={
                      <Exercise
                        initVerbs={module.words}
                        progress={progress.find(
                          (progress) => progress.moduleName === module.title
                        )}
                        setProgress={setProgress}
                      />
                    }
                  />
                ))}
              {mode === "guest" &&
                Object.entries(DATA).map(([key, module]) => (
                  <Route
                    key={key}
                    path={`/${module.name}`}
                    element={<Exercise mode={mode} initVerbs={module.words} />}
                  />
                ))}
              <Route
                path="/account"
                element={
                  <Account
                    dbAccount={dbAccount}
                    progress={progress}
                    modules={modules}
                    authorized={authorized}
                  />
                }
              />
              <Route path="/lesson" element={<Lesson />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/login"
                element={
                  <Login
                    setMode={setMode}
                    setDbAccount={setDbAccount}
                    setLogged={setLogged}
                    setAuthorized={setAuthorized}
                  />
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addmodule" element={<AddModule />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AccountContext>
    </>
  );
}

export default App;
