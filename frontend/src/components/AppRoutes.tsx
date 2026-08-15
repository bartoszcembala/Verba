import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Account from "../pages/Account";
import Exercise from "../pages/Exercise";
import Home from "../pages/Home";
import Layout from "../pages/Layout";
import Dashboard from "../pages/Dashboard";
import Exercises from "../pages/Exercises";
import Lessons from "../pages/Lessons";
import Lesson from "../pages/Lesson";
import { useLessons } from "../lib/queries/lessonsQueries";
import { useModules } from "../lib/queries/modulesQueries";
import BuyPremium from "../pages/BuyPremium";
import NotFound from "../pages/NotFound";
import User from "../pages/User";
import Leaderboard from "../pages/Leaderboard";
import XpGuide from "../pages/XpGuide";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  const { modules } = useModules();
  const { lessons } = useLessons();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/buy-premium" element={<BuyPremium />} />
            <Route path="/xp-guide" element={<XpGuide />} />
            <Route path="/profile/:userId" element={<User />} />

            {modules &&
              modules.map((module) => (
                <Route
                  key={module._id}
                  path={`/${module.title}`}
                  element={<Exercise initVerbs={module.words} />}
                />
              ))}

            {lessons &&
              lessons.map((lesson) => (
                <Route
                  key={lesson._id}
                  path={`/${lesson.title}`}
                  element={<Lesson lesson={lesson} />}
                />
              ))}
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
