import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { calculatePercent } from "../../lib/calculatePercent";
import type { AnswerStat } from "./types";

type ChartProps = {
  stats: AnswerStat[];
};

function Chart({ stats }: ChartProps) {
  const learned = stats.find(({ name }) => name === "correct")?.value ?? 0;
  const remaining = stats.find(({ name }) => name === "wrong")?.value ?? 0;
  const total = learned + remaining;
  const percentage = calculatePercent(learned, total);
  const chartData = [
    { name: "Learned", value: learned, color: "var(--chart-learned)" },
    { name: "To learn", value: remaining, color: "var(--chart-remaining)" },
  ];

  return (
    <aside className="rounded-xl border border-neutral-200 bg-white p-5 [--chart-learned:#4f46e5] [--chart-remaining:#e5e7eb] [--chart-tooltip:#fff] [--chart-tooltip-border:#e5e7eb] dark:border-neutral-800 dark:bg-neutral-900 dark:[--chart-learned:#818cf8] dark:[--chart-remaining:#262626] dark:[--chart-tooltip:#171717] dark:[--chart-tooltip-border:#404040]">
      <div className="mb-4">
        <p className="text-[1.15rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">Progress</p>
        <h2 className="mt-1 text-[1.65rem] font-semibold tracking-tight">Words in this module</h2>
      </div>

      {total > 0 ? (
        <div>
          <div className="relative mx-auto h-[18rem] w-full max-w-[20rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={58}
                  outerRadius={76}
                  paddingAngle={learned > 0 && remaining > 0 ? 3 : 0}
                  cornerRadius={5}
                  stroke="none"
                  animationDuration={700}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: "var(--chart-tooltip)",
                    border: "1px solid var(--chart-tooltip-border)",
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgb(0 0 0 / 0.08)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <strong className="text-[2.8rem] font-semibold leading-none tracking-tight">{percentage}%</strong>
              <span className="mt-1 text-[1.1rem] text-neutral-500">complete</span>
            </div>
          </div>

          <div className="space-y-2.5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <div className="flex items-center justify-between text-[1.2rem]">
              <span className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-300">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                Learned
              </span>
              <strong className="font-semibold">{learned}</strong>
            </div>
            <div className="flex items-center justify-between text-[1.2rem]">
              <span className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-300">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                To learn
              </span>
              <strong className="font-semibold">{remaining}</strong>
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2.5 text-center text-[1.15rem] text-neutral-500 dark:bg-neutral-800/60">
            {learned} of {total} words learned
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-neutral-50 px-4 py-8 text-center dark:bg-neutral-800/60">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-white text-[1.6rem] text-neutral-400 shadow-sm dark:bg-neutral-800">0%</span>
          <p className="text-[1.25rem] font-medium">No words here yet</p>
          <p className="mt-1 text-[1.1rem] text-neutral-500">Add words to this module to track progress.</p>
        </div>
      )}
    </aside>
  );
}

export default Chart;
