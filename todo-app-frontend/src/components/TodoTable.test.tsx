import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TodoTable from "./TodoTable";
import { describe, it, expect, vi } from "vitest";

describe("TodoTable", () => {
  it("Render main todoTable", () => {
    const mockTodoList = [
      {
        id: 1,
        taskName: "First task",
        priority: "High",
        dueDate: "2025-04-27",
        todoState: false,
      },
      {
        id: 2,
        taskName: "Second task",
        priority: "Low",
        dueDate: "",
        todoState: true,
      },
    ];

    render(
      <TodoTable
        todoList={mockTodoList}
        reload={vi.fn()}
        handleSortSelection={vi.fn()}
        handleMetricsReload={vi.fn()}
      />
    );
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
  });
});
