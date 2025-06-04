/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login.js";
import Signup from "../pages/Signup.js";
import Account from "../pages/Account.jsx";
import Exercise from "../pages/Exercise.js";
import Home from "../pages/Home.js";
import Layout from "../pages/Layout.js";
import DATA from "../data/verbs.js";
import Dashboard from "../pages/Dashboard.js";
import AddModule from "../pages/AddModule.jsx";
import { useContext } from "react";
import { SettingsContext } from "../lib/contexts.js";
import Exercises from "../pages/Exercises.js";
import Lessons from "../pages/Lessons.js";
import Lesson from "../pages/Lesson.js";

import { useLessons } from "../lib/queries/lessonsQueries.js";
import { useModules } from "../lib/queries/modulesQueries.js";
import { useProgress } from "../lib/queries/progressQueries.js";

function AppRoutes() {
  const { mode, authorized } = useContext(SettingsContext)!;
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
                element={<Exercise initVerbs={module.words} />}
              />
            ))}

          {mode === "user" &&
            lessons &&
            authorized &&
            lessons.map((lesson) => (
              <Route
                key={lesson._id}
                path={`/${lesson.title}`}
                element={<Lesson lesson={lesson} />}
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
