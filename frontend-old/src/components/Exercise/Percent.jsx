/* eslint-disable react/prop-types */
import { useContext } from "react";
import { calculatePercent } from "../../lib/calculatePercent";
import { ExerciseContext } from "../../lib/contexts";

function Percent({ activeProgress }) {
  const { verbs } = useContext(ExerciseContext);

  return (
    <span className="ml-10">
      {calculatePercent(activeProgress?.learned.length, verbs.length) + "%"}
    </span>
  );
}

export default Percent;
