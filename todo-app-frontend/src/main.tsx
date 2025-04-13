import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TodoApp from "./TodoApp";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="container">
      <TodoApp />
    </div>
  </StrictMode>
);
