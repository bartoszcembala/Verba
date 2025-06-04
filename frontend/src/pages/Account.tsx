/* eslint-disable react/prop-types */
import { calculatePercent } from "../lib/calculatePercent";
import "../App.css";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getPreviousDates } from "../lib/getPreviousDates";

import { useProgress } from "../lib/queries/progressQueries";
import { useModules } from "../lib/queries/modulesQueries";
import { User } from "../types";

function Account() {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();
  const previousDates = getPreviousDates(4);
  if (isLoadingModules || isLoadingProgress) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-[90rem] flex flex-col gap-8">
        {user ? (
          <>
            <div className="rounded-2xl border-1 border-neutral-400 py-10 px-20">
              <div className="flex gap-20">
                <img
                  src="https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"
                  className="w-30 h-30 rounded-full border-2 border-neutral-300"
                />
                <h1 className="text-8xl pt-5">{user.name}</h1>
              </div>
              <br />
              {progress?.map((module) => {
                const wordsNumber = modules!.find(
                  (m) => m.title === module.moduleName
                )!.words.length;
                return (
                  <p key={module._id}>
                    {" "}
                    Dział: {module.moduleName} | Progress:{" "}
                    {calculatePercent(module.learned.length, wordsNumber)}%
                  </p>
                );
              })}
            </div>

            <div className="flex gap-8 w-[90rem]">
              <div className="rounded-2xl border-1 border-neutral-400 w-full py-4 px-8">
                <h3>Latest activity: </h3>
                {user.latestActivity.map((activity) => {
                  return (
                    <Link
                      to={`/${activity}`}
                      key={activity}
                      className="py-1 px-8 block"
                    >
                      {activity}
                      <span> ➡</span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-2 border-1  border-neutral-400 rounded-2xl p-5">
                {" "}
                <div className="border-r-1 h-full flex items-center pr-8 border-neutral-400">
                  STREAK: {user.streak.length}d
                </div>
                {previousDates.map((date) => (
                  <span
                    key={date}
                    className="h-30 w-30 text-center rounded-2xl pt-4 "
                  >
                    <span className="block text-5xl pb-4">
                      {user.streak.includes(date) ? "🔥" : "⚫"}
                    </span>
                    <span className="block text-neutral-300">
                      {date.split("-")[2]}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>Please log in</div>
        )}
        <Link to="/dashboard">
          <button className="btn dashboard">🔐</button>
        </Link>
      </div>
    </div>
  );
}

export default Account;
