/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Account from "../pages/Account";
import Exercise from "../pages/Exercise";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import DATA from "../data/verbs";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AddModule from "../pages/AddModule";
import Lesson from "../pages/Lesson";
import { useContext } from "react";
import { SettingsContext } from "../lib/contexts";
import { useModules, useProgress } from "../lib/queries";

function AppRoutes({ setProgress  }) {
  const { mode } = useContext(SettingsContext);
  const { progress } = useProgress();
  const { modules } = useModules();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout/>}
        >
          <Route index element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addmodule" element={<AddModule />} />

          {/* User  mode routes */}
          {mode === "user" &&
            modules &&
            progress &&
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

          {/* Guest mode routes */}
          {mode === "guest" &&
            Object.entries(DATA).map(([key, module]) => (
              <Route
                key={key}
                path={`/${module.name}`}
                element={<Exercise initVerbs={module.words} />}
              />
            ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
