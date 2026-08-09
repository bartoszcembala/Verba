import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import type { Progress } from "../../types";
import Percent from "./Percent";
import type { AnswerStat } from "./types";

type ChartProps = {
  correct: AnswerStat[];
  activeProgress?: Progress;
};

function Chart({ correct, activeProgress }: ChartProps) {
  return (
    <aside className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      {correct[0].value !== 0 || correct[1].value !== 0 ? (
        <div className="text-center">
          <p className="text-[1.35rem] font-medium">
            {correct[0].value}/{correct[1].value}
            <Percent activeProgress={activeProgress} />
          </p>

          <PieChart width={210} height={240}>
            <Pie
              data={correct}
              name="name"
              dataKey={"value"}
              innerRadius={38}
              animationDuration={1000}
              animationBegin={0}
            >
              {correct.map((entry) => (
                <Cell
                  fill={entry.color}
                  stroke={entry.color}
                  key={entry.name}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" />
          </PieChart>
        </div>
      ) : (
        <p className="py-8 text-center text-[1.3rem] text-neutral-500">Answer a question to see your progress.</p>
      )}
    </aside>
  );
}

export default Chart;
