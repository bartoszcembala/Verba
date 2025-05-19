/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "../App.css";
import { useContext } from "react";
import { AccountCtx } from "../lib/AccountContext";
import {
  calculatePercent,
  calculatePercentContext,
} from "../lib/calculatePercent";
import DATA from "../data/verbs";

function Home({ modules, logged, mode, progress }) {
  const { account } = useContext(AccountCtx);

  function percentWEmoji(val1, val2) {
    const percent = calculatePercent(val1, val2);
    let emoji = "";

    if (percent >= 80) {
      emoji = "🟩";
    } else if (percent >= 50) {
      emoji = "🟨";
    } else if (percent >= 25) {
      emoji = "🟧";
    } else if (percent >= 0) {
      emoji = "🟥";
    }

    return emoji + " " + percent;
  }
  function percentWEmojiContext(val1, val2) {
    const percent = calculatePercentContext(val1, val2);
    let emoji = "";

    if (percent >= 80) {
      emoji = "🟩";
    } else if (percent >= 50) {
      emoji = "🟨";
    } else if (percent >= 25) {
      emoji = "🟧";
    } else if (percent >= 0) {
      emoji = "🟥";
    }

    return emoji + " " + percent;
  }

  return (
    <div>
      <div className="btnContainer">
        {mode === "user" &&
          logged &&
          modules &&
          modules.map((module) => {
            const wordsNumber = progress.find(
              (m) => m.moduleName === module.title
            )?.learned.length;

            return (
              <Link
                key={module._id}
                to={`/${module.title}`}
                className="btn lessonBtn link"
              >
                {`${module.title.slice(0, -2)} ${module.title.slice(-2)}`}{" "}
                {percentWEmoji(wordsNumber, module.words.length)}%
              </Link>
            );
          })}
        {mode === "guest" &&
          Object.entries(DATA).map(([key, module]) => (
            <Link
              key={key}
              to={`/${module.name}`}
              className="btn lessonBtn link"
            >
              {module.nameDisplay}{" "}
              {percentWEmojiContext(
                account.modulesPercent[module.name].length,
                account.notLearned[module.name].length
              )}
              %
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Home;
