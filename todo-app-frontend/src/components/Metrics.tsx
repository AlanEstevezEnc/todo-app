import { useState } from "react";

interface Props {
  metricStats: {
    lowAverage: string;
    midAverage: string;
    Average: string;
    highAverage: string;
  };
}

function Metrics({ metricStats }: Props) {
  //const [count, setCount] = useState(0)

  return (
    <>
      <div className="metricsContainer container text-center">
        <div className="row justify-content-center">
          <div className="col-6 ">
            <h4>Average time to finish tasks:</h4>
            <div className="text-center">
              <p>Time: {metricStats.Average}</p>
            </div>
          </div>
          <div className="col-6 ">
            <h4>Average time to finish tasks by priority:</h4>
            <p>Low: {metricStats.lowAverage}</p>
            <p>Medium: {metricStats.midAverage}</p>
            <p>High: {metricStats.highAverage}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Metrics;
