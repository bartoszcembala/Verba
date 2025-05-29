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
import { useContext } from "react";
import { SettingsContext } from "../lib/contexts";
import { useLessons, useModules, useProgress } from "../lib/queries";
import Exercises from "../pages/Exercises";
import Lessons from "../pages/Lessons";
import Lesson from "../pages/Lesson";

function AppRoutes({ setProgress }) {
  const { mode, authorized } = useContext(SettingsContext);
  const { progress } = useProgress();
  const { modules } = useModules();
  const { lessons } = useLessons();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addmodule" element={<AddModule />} />

          {/* User  mode routes */}
          {mode === "user" &&
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

          {mode === "user" &&
            lessons &&
            authorized &&
            lessons.map((lesson) => (
              <Route
                key={lesson._id}
                path={`/${lesson.title}`}
                element={<Lesson html={lesson.html} lesson={lesson} />}
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
