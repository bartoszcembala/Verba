/* eslint-disable react/prop-types */
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import Percent from "./Percent";
import { useContext } from "react";
import { ExerciseContext } from "../../lib/contexts";

function Chart({ correct, activeProgress }) {
  const { mode, verbs } = useContext(ExerciseContext);

  return (
    <div>
      {correct[0].value !== 0 || correct[1].value !== 0 ? (
        <>
          <Percent
            correct={correct}
            mode={mode}
            activeProgress={activeProgress}
            verbs={verbs}
          />
          <PieChart width={150} height={200}>
            <Pie
              data={correct}
              name="name"
              dataKey="value"
              innerRadius={25}
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
        </>
      ) : (
        <p>Answer to see chart</p>
      )}
    </div>
  );
}

export default Chart;
