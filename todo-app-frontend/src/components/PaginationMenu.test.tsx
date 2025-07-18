import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationMenu from "./PaginationMenu"; // Update path

describe("PaginationMenu", () => {
  const onSelectMock = vi.fn();

  beforeEach(() => {
    onSelectMock.mockClear();
  });

  it("renders correct number of page buttons", () => {
    render(
      <PaginationMenu pageCount={5} paginaActual={0} onSelect={onSelectMock} />
    );

    const pageButtons = [1, 2, 3, 4, 5].map((n) =>
      screen.getByText(n.toString())
    );

    expect(pageButtons).toHaveLength(5);
  });

  it("highlights the active page", () => {
    render(
      <PaginationMenu pageCount={3} paginaActual={1} onSelect={onSelectMock} />
    );

    const activeItem = screen.getByText("2").closest("li");
    expect(activeItem).toHaveClass("active");
  });

  it("calls onSelect when clicking a page number", () => {
    render(
      <PaginationMenu pageCount={4} paginaActual={0} onSelect={onSelectMock} />
    );

    const pageThree = screen.getByText("3");
    fireEvent.click(pageThree);

    expect(onSelectMock).toHaveBeenCalledWith(2);
  });

  it("calls onSelect when clicking 'Next'", () => {
    render(
      <PaginationMenu pageCount={4} paginaActual={1} onSelect={onSelectMock} />
    );

    const next = screen.getByText("Next");
    fireEvent.click(next);

    expect(onSelectMock).toHaveBeenCalledWith(2);
  });

  it("does not call onSelect on 'Next' if on last page", () => {
    render(
      <PaginationMenu pageCount={3} paginaActual={2} onSelect={onSelectMock} />
    );

    const next = screen.getByText("Next");
    fireEvent.click(next);

    expect(onSelectMock).not.toHaveBeenCalled();
  });

  it("calls onSelect when clicking 'Previous'", () => {
    render(
      <PaginationMenu pageCount={4} paginaActual={2} onSelect={onSelectMock} />
    );

    const previous = screen.getByText("Previous");
    fireEvent.click(previous);

    expect(onSelectMock).toHaveBeenCalledWith(1);
  });

  it("does not call onSelect on 'Previous' if on first page", () => {
    render(
      <PaginationMenu pageCount={3} paginaActual={0} onSelect={onSelectMock} />
    );

    const previous = screen.getByText("Previous");
    fireEvent.click(previous);

    expect(onSelectMock).not.toHaveBeenCalled();
  });
});
