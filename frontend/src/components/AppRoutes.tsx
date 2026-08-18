import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLessons } from "../lib/queries/lessonsQueries";
import { useModules } from "../lib/queries/modulesQueries";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "./Spinner";

const Account = lazy(() => import("../pages/Account"));
const BuyPremium = lazy(() => import("../pages/BuyPremium"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Exercise = lazy(() => import("../pages/Exercise"));
const Exercises = lazy(() => import("../pages/Exercises"));
const Home = lazy(() => import("../pages/Home"));
const Layout = lazy(() => import("../pages/Layout"));
const Leaderboard = lazy(() => import("../pages/Leaderboard"));
const Lesson = lazy(() => import("../pages/Lesson"));
const Lessons = lazy(() => import("../pages/Lessons"));
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Signup = lazy(() => import("../pages/Signup"));
const User = lazy(() => import("../pages/User"));
const XpGuide = lazy(() => import("../pages/XpGuide"));

function AppRoutes() {
  const { modules } = useModules();
  const { lessons } = useLessons();

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="grid min-h-screen place-items-center"><Spinner /></div>}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
