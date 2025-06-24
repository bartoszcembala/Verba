/* eslint-disable react/prop-types */
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import Percent from "./Percent";

function Chart({ correct, activeProgress, mode }) {
  return (
    <div>
      {correct[0].value !== 0 || correct[1].value !== 0 ? (
        <div className=" w-[20rem] ">
          <Percent correct={correct} activeProgress={activeProgress} />
          <PieChart width={210} height={240}>
            <Pie
              data={correct}
              name="name"
              dataKey={mode === "guest" ? "value.length" : "value"}
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
        </div>
      ) : (
        <p>Answer to see chart</p>
      )}
    </div>
  );
}

export default Chart;
