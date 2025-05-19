/* eslint-disable react/prop-types */
import { calculatePercent } from "../lib/calculatePercent";
import "../App.css";
import { Link } from "react-router-dom";

function Account({ dbAccount, authorized, progress, modules }) {

  return (
    <div className="containerAcc">
      <div className="divContainer">
        {authorized && dbAccount ? (
          <>
            <div className="insideContainerAcc">
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
            <div className="accDiv">Streak</div>
            <div className="accDiv">Modules</div>
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
