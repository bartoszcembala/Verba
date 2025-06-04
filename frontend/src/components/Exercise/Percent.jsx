/* eslint-disable react/prop-types */
import {
  calculatePercent,
  calculatePercentContext,
} from "../../lib/calculatePercent";

function Percent({ mode, correct, activeProgress, verbs }) {
  return (
    <p>
      {mode === "guest" &&
        calculatePercentContext(
          correct[0].value.length,
          correct[1].value.length
        ) + "%"}
      {mode === "user" &&
        calculatePercent(activeProgress?.learned.length, verbs.length) + "%"}
    </p>
  );
}

export default Percent;
