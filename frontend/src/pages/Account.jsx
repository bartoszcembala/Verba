/* eslint-disable react/prop-types */
import { calculatePercent } from "../lib/calculatePercent";
import "../App.css";
import { Link } from "react-router-dom";
import { SettingsContext } from "../lib/contexts";
import { useContext } from "react";
import { useModules, useProgress } from "../lib/queries";
import { getPreviousDates } from "../lib/getPreviousDates";

function Account({ dbAccount }) {
  const { authorized } = useContext(SettingsContext);
  const { modules, isLoadingModules } = useModules();
  const { progress, isLoadingProgress } = useProgress();
  const previousDates = getPreviousDates(5);

  if (isLoadingModules || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-48 h-48 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="containerAcc">
      <div className="divContainer">
        {authorized && dbAccount ? (
          <>
            <div className="insideContainerAcc border-1 border-solid border-neutral-400">
              <h1>{dbAccount.name}</h1>
              <br />
              {progress.map((module) => {
                const wordsNumber = modules.find(
                  (m) => m.title === module.moduleName
                )?.words.length;
                console.log(wordsNumber, module.learned.length);
                return (
                  <p key={module._id}>
                    {" "}
                    Dział: {module.moduleName} | Progress:{" "}
                    {calculatePercent(module.learned.length, wordsNumber)}%
                  </p>
                );
              })}
              {/* {Object.entries(DATA).map(([key, value]) => (
                <p key={key}>
                  Dział: {value.nameDisplay} | Progress:{" "}
                  {calculatePercent(
                    account.modulesPercent[value.name].length,
                    account.notLearned[value.name].length
                  )}
                  %
                </p>
              ))} */}
            </div>
            <div className="accDiv flex items-center justify-center gap-2">
              {previousDates.map((date) => (
                <span
                  key={date}
                  className="h-30 w-30 text-center flex items-center justify-center border-1 border-solid border-neutral-400 rounded-2xl"
                >
                  {date.split("-")[2]}🔥
                </span>
              ))}
            </div>
            <div className="accDiv border-1 border-solid border-neutral-400">
              Modules
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
