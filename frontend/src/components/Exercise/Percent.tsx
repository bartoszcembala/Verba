import { useContext } from "react";
import { calculatePercent } from "../../lib/calculatePercent";
import { ExerciseContext } from "../../lib/contexts";
import type { Progress } from "../../types";

type PercentProps = {
  activeProgress?: Progress;
};

function Percent({ activeProgress }: PercentProps) {
  const { verbs } = useContext(ExerciseContext)!;

  return (
    <span className="ml-2 text-neutral-500">
      {calculatePercent(activeProgress?.learned.length ?? 0, verbs.length) + "%"}
    </span>
  );
}

export default Percent;
