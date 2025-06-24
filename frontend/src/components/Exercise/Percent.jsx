/* eslint-disable react/prop-types */
import { useContext } from "react";
import {
  calculatePercent,
  calculatePercentContext,
} from "../../lib/calculatePercent";
import { ExerciseContext } from "../../lib/contexts";

function Percent({ correct, activeProgress }) {
  const { mode, verbs } = useContext(ExerciseContext);
  return (
    <p className="ml-25">
      {mode === "guest" &&
        calculatePercentContext(
          correct[0]?.value?.length,
          correct[1]?.value?.length
        ) + "%"}
      {mode === "user" &&
        calculatePercent(activeProgress?.learned.length, verbs.length) + "%"}
    </p>
  );
}

export default Percent;
