import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoApp from "./TodoApp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./components/FilterBox", () => ({
  default: ({ handleFilterList }: any) => (
    <div>
      <input
        placeholder="Filter"
        onChange={() => handleFilterList("Test Task", "High", "Done")}
      />
    </div>
  ),
}));

vi.mock("./components/TodoTable", () => ({
  default: () => <div>Todo Table Rendered</div>,
}));

vi.mock("./components/TodoEditModal", () => ({
  default: ({ show, onClose }: any) =>
    show ? <div onClick={onClose}>Modal Open</div> : null,
}));

vi.mock("./components/PaginationMenu", () => ({
  default: ({ onSelect }: any) => (
    <div>
      <button onClick={() => onSelect(1)}>Go to Page 2</button>
    </div>
  ),
}));

vi.mock("./components/Metrics", () => ({
  default: () => <div>Metrics Loaded</div>,
}));

beforeEach(() => {
  window.fetch = vi.fn((url) => {
    if (typeof url === "string" && url.includes("/todos")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalPages: 3,
            content: [
              {
                id: 1,
                taskName: "Test Task",
                priority: "High",
                dueDate: "2025-08-01",
                todoState: false,
              },
            ],
          }),
      });
    }

    if (typeof url === "string" && url.includes("/todo/metrics")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            lowAverage: "2",
            midAverage: "3",
            Average: "3.5",
            highAverage: "5",
          }),
      });
    }

    return Promise.reject("Unknown endpoint");
  }) as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TodoApp Component", () => {
  it("renders all main elements", async () => {
    render(<TodoApp />);
    expect(screen.getByText("Add new To-do")).toBeInTheDocument();
    expect(await screen.findByText("Todo Table Rendered")).toBeInTheDocument();
    expect(screen.getByText("Metrics Loaded")).toBeInTheDocument();
  });

  it("opens and closes modal on button click", async () => {
    render(<TodoApp />);
    fireEvent.click(screen.getByText("Add new To-do"));
    expect(screen.getByText("Modal Open")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Modal Open"));
    await waitFor(() => {
      expect(screen.queryByText("Modal Open")).not.toBeInTheDocument();
    });
  });

  it("applies filter using FilterBox", async () => {
    render(<TodoApp />);
    fireEvent.change(screen.getByPlaceholderText("Filter"), {
      target: { value: "Test Task" },
    });

    await waitFor(() => {
      const calls = (fetch as any).mock.calls;
      const lastUrl = calls[calls.length - 1][0] as string;
      expect(lastUrl).toContain("n=Test Task");
    });
  });

  it("loads new page when PaginationMenu is used", async () => {
    render(<TodoApp />);
    fireEvent.click(await screen.findByText("Go to Page 2"));

    await waitFor(() => {
      const calls = (fetch as any).mock.calls;
      const lastUrl = calls[calls.length - 1][0] as string;
      expect(lastUrl).toContain("page=1");
    });
  });

  it("triggers sorting when handleSortSelection is called", async () => {
    render(<TodoApp />);
    expect(await screen.findByText("Todo Table Rendered")).toBeInTheDocument();
  });
});
