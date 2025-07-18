import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoEditModal from "./TodoEditModal"; // <-- Update path

// Mock API response
window.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        taskName: "Test Task",
        priority: "Medium",
        dueDate: "2025-07-20",
      }),
  })
) as any;

describe("TodoEditModal", () => {
  const defaultProps = {
    mode: true,
    show: true,
    onClose: vi.fn(),
    reload: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with correct title for Create mode", () => {
    render(<TodoEditModal {...defaultProps} />);
    expect(screen.getByText("Create To-do")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("renders modal with correct title for Edit mode and loads task data", async () => {
    render(<TodoEditModal {...defaultProps} mode={false} todoId={123} />);

    expect(screen.getByText("Edit To-do")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2025-07-20")).toBeInTheDocument();
    });
  });

  it("allows changing task name and date", () => {
    render(<TodoEditModal {...defaultProps} />);

    const input = screen.getByLabelText("Name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "New Task" } });
    expect(input.value).toBe("New Task");

    const dateInput = screen.getByLabelText("Due date") as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2025-07-30" } });
    expect(dateInput.value).toBe("2025-07-30");
  });

  it("calls onClose and reload on successful creation", async () => {
    render(<TodoEditModal {...defaultProps} />);

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "New Task" } });

    const submit = screen.getByText("Create");
    fireEvent.click(submit);

    await waitFor(() => {
      expect(defaultProps.reload).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("clears date on Clear date button click", () => {
    render(<TodoEditModal {...defaultProps} />);
    const dateInput = screen.getByLabelText("Due date") as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2025-07-30" } });
    expect(dateInput.value).toBe("2025-07-30");

    const clearButton = screen.getByText("Clear date");
    fireEvent.click(clearButton);
    expect(dateInput.value).toBe("");
  });
});
