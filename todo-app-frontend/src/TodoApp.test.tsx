import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TodoApp from "./TodoApp";
import { describe, it, expect } from "vitest";

describe("TodoApp", () => {
  it("Main app render with Add Todo button", () => {
    render(<TodoApp />);
    expect(screen.getByText("Add new To-do")).toBeInTheDocument();
  });

  /*
  it("debe abrir un modal al hacer clic en el botón 'Add new To-do'", () => {
    render(<TodoApp />);
    const button = screen.getByText("Add new To-do");
    button.click();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });*/
});
