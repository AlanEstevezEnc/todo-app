import { render, screen, fireEvent } from "@testing-library/react";
import FilterBox from "./FilterBox";
import { describe, expect, it, vi } from "vitest";

describe("FilterBox", () => {
  it("renders all input fields and the Search button", () => {
    render(<FilterBox handleFilterList={() => {}} />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("updates filters on input/select change", () => {
    render(<FilterBox handleFilterList={() => {}} />);

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: "test name" } });
    expect((nameInput as HTMLInputElement).value).toBe("test name");

    const prioritySelect = screen.getByLabelText(/Priority/i);
    fireEvent.change(prioritySelect, { target: { value: "High" } });
    expect((prioritySelect as HTMLSelectElement).value).toBe("High");

    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: "true" } });
    expect((stateSelect as HTMLSelectElement).value).toBe("true");
  });

  it("calls handleFilterList with correct values on Search button click", () => {
    const mockHandleFilterList = vi.fn();

    render(<FilterBox handleFilterList={mockHandleFilterList} />);

    // Set inputs
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "task1" },
    });
    fireEvent.change(screen.getByLabelText(/Priority/i), {
      target: { value: "Medium" },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: "false" },
    });

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(mockHandleFilterList).toHaveBeenCalledWith(
      "task1",
      "Medium",
      "false"
    );
  });

  it("calls handleFilterList with default empty strings if no inputs changed", () => {
    const mockHandleFilterList = vi.fn();

    render(<FilterBox handleFilterList={mockHandleFilterList} />);

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    // Because the default state for filters is ""
    expect(mockHandleFilterList).toHaveBeenCalledWith("", "", "");
  });
});
