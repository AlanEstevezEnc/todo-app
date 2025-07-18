import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoTable from "./TodoTable"; // Update this to the correct path

// Mock Modal (optional: to isolate tests)
vi.mock("./TodoEditModal", () => ({
  default: () => <div data-testid="mock-modal">Mock Modal</div>,
}));

const mockTodos = [
  {
    id: 1,
    taskName: "Task 1",
    priority: "High",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 3 days from now
    todoState: false,
  },
  {
    id: 2,
    taskName: "Task 2",
    priority: "Low",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 10 days from now
    todoState: true,
  },
  {
    id: 3,
    taskName: "Task 3",
    priority: "Medium",
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 20 days from now
    todoState: false,
  },
];

describe("TodoTable", () => {
  const mockReload = vi.fn();
  const mockSort = vi.fn();
  const mockMetrics = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all todos in rows", () => {
    render(
      <TodoTable
        todoList={mockTodos}
        reload={mockReload}
        handleSortSelection={mockSort}
        handleMetricsReload={mockMetrics}
      />
    );

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("applies strikethrough class for completed tasks", () => {
    render(
      <TodoTable
        todoList={mockTodos}
        reload={mockReload}
        handleSortSelection={mockSort}
        handleMetricsReload={mockMetrics}
      />
    );

    const row = screen.getByText("Task 2").closest("tr");
    expect(row?.className).toContain("strikethrough");
  });

  it("applies correct background colors based on due date proximity", () => {
    render(
      <TodoTable
        todoList={mockTodos}
        reload={mockReload}
        handleSortSelection={mockSort}
        handleMetricsReload={mockMetrics}
      />
    );

    const rows = screen.getAllByRole("row");
    const task1Row = screen.getByText("Task 1").closest("tr");
    const task2Row = screen.getByText("Task 2").closest("tr");
    const task3Row = screen.getByText("Task 3").closest("tr");

    expect(task1Row?.className).toContain("table-danger"); // < 7 days
    expect(task2Row?.className).toContain("table-warning"); // 7-14 days
    expect(task3Row?.className).toContain("table-success"); // > 14 days
  });

  it("opens modal when Edit is clicked", () => {
    render(
      <TodoTable
        todoList={mockTodos}
        reload={mockReload}
        handleSortSelection={mockSort}
        handleMetricsReload={mockMetrics}
      />
    );

    const editBtn = screen.getAllByText("Edit")[0];
    fireEvent.click(editBtn);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });

  it("calls sorting handler when header clicked", () => {
    render(
      <TodoTable
        todoList={mockTodos}
        reload={mockReload}
        handleSortSelection={mockSort}
        handleMetricsReload={mockMetrics}
      />
    );

    const prioHeader = screen.getByText(/Priority/);
    fireEvent.click(prioHeader);

    expect(mockSort).toHaveBeenCalled();
  });

  it("calls reload and metrics on delete confirm", async () => {
    window.confirm = vi.fn(() => true); // Force confirm dialog to return true

    window.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    ) as any;

    render(
      <TodoTable
        todoList={mockTodos}
        reload={mockReload}
        handleSortSelection={mockSort}
        handleMetricsReload={mockMetrics}
      />
    );

    const deleteBtn = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalled();
      expect(mockReload).toHaveBeenCalled();
      expect(mockMetrics).toHaveBeenCalled();
    });
  });
});
