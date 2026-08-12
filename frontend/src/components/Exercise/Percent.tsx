import { calculatePercent } from "../../lib/calculatePercent";
import type { Progress } from "../../types";

type PercentProps = {
  activeProgress?: Progress;
  totalWords: number;
};

function Percent({ activeProgress, totalWords }: PercentProps) {
  return (
    <span className="ml-2 text-neutral-500">
      {calculatePercent(activeProgress?.learned.length ?? 0, totalWords) + "%"}
    </span>
  );
}

export default Percent;
