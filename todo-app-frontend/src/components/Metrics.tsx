interface Props {
  metricStats: {
    lowAverage: string;
    midAverage: string;
    Average: string;
    highAverage: string;
  };
}

function Metrics({ metricStats }: Props) {
  return (
    <>
      <div className="metricsContainer container text-center">
        <div className="row justify-content-center">
          <div className="col-6 ">
            <h4>Average time to finish tasks:</h4>
            <div className="text-center">
              <p>Time: {metricStats.Average} Hours:Minutes</p>
            </div>
          </div>
          <div className="col-6 ">
            <h4>Average time to finish tasks by priority:</h4>
            <p>Low: {metricStats.lowAverage} Hours:Minutes</p>
            <p>Medium: {metricStats.midAverage} Hours:Minutes</p>
            <p>High: {metricStats.highAverage} Hours:Minutes</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Metrics;
