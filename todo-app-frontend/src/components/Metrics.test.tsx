import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Metrics from "./Metrics";
import { describe, it, expect, vi } from "vitest";

describe("Metrics", () => {
  it("Render metrics stats", () => {
    const metricStats = {
      lowAverage: "5:22",
      midAverage: "12:5",
      highAverage: "1:54",
      Average: "2:30",
    };

    render(<Metrics metricStats={metricStats} />);
    //expect(screen.getByText("Time: 5:22 Hours:Minutes")).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("Time: 2:30 Hours:Minutes")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) => content.includes("Low: 5:22 Hours:Minutes"))
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("Medium: 12:5 Hours:Minutes")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        content.includes("High: 1:54 Hours:Minutes")
      )
    ).toBeInTheDocument();
  });
});
