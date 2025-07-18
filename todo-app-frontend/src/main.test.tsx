import { vi, describe, it, expect } from "vitest";
import ReactDOM from "react-dom/client";

const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock("react-dom/client", async () => {
  const actual = await vi.importActual<typeof ReactDOM>("react-dom/client");
  return {
    ...actual,
    createRoot: mockCreateRoot,
  };
});

describe("Entry point (main.tsx)", () => {
  it("calls createRoot and renders TodoApp without crashing", async () => {
    const container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    await import("./main");

    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
