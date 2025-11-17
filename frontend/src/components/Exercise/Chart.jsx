/* eslint-disable react/prop-types */
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import Percent from "./Percent";

function Chart({ correct, activeProgress }) {
  return (
    <div>
      {correct[0].value !== 0 || correct[1].value !== 0 ? (
        <div className=" w-[20rem] ">
          <p>
            {correct[0].value}/{correct[1].value}
            <Percent correct={correct} activeProgress={activeProgress} />
          </p>

          <PieChart width={210} height={240}>
            <Pie
              data={correct}
              name="name"
              dataKey={"value"}
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
