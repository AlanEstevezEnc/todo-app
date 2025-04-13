import { MouseEventHandler, useEffect, useState } from "react";

interface Props {
  mode: Boolean;
  show: Boolean;
  onClose: () => void;
  todoId?: number;
  reload: () => void;
}

function TodoEditModal({ mode, onClose, show, todoId, reload }: Props) {
  //const [count, setCount] = useState(0)
  //const [isOpen, setIsOpen] = useState(false);
  //const [createTodo, setCreateTodo] = useState(true);
  const [taskName, setTaskName] = useState("");
  const [prio, setPrio] = useState(1);
  const [date, setDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleDateClick = (e: React.MouseEvent) => {
    //e.preventDefault();
    const dateInput = document.getElementById("datePicker") as HTMLInputElement;
    setDate("");
    if (dateInput) {
      dateInput.value = "";
    }
  };

  useEffect(() => {
    if (show) {
      // Este código se ejecuta solo cuando el modal se abre.

      if (!mode) {
        if (todoId) {
          console.log("Editando todo con id:", todoId);
          // Aquí va la lógica para editar el todo

          const fetchTodo = async () => {
            try {
              const response = await fetch(
                `http://localhost:9090/todo?id=${todoId}`
              );
              const data = await response.json();
              console.log(data);
              setTaskName(data.taskName);

              if (data.dueDate) {
                setDate(data.dueDate);
              } else {
                setDate("");
              }

              switch (data.priority) {
                case "High":
                  setPrio(1);
                  break;
                case "Medium":
                  setPrio(2);
                  break;
                case "Low":
                  setPrio(3);
                  break;
              }
              //setPrio(inversePriorityMap[data.priority]);
              //console.log(data.content);
            } catch (error) {
              console.error("Error al obtener los usuarios:", error);
            }
          };
          fetchTodo();
        }
        // Aquí va la lógica que necesitas para la creación
      }
    }

    // Dependencias: solo se ejecuta cuando el valor de `show` cambie
  }, [show, mode, todoId]);

  const todoEditAdd = () => {
    if (taskName === "") {
      alert("Task name can't be empty");
    } else if (taskName.length > 120) {
      alert("Task name length can't be longer than 120 characters");
    } else {
      var prioString = "";
      switch (prio) {
        case 1:
          prioString = "High";
          break;
        case 2:
          prioString = "Medium";
          break;
        case 3:
          prioString = "Low";
          break;
      }

      if (mode) {
        //Create todo
        const createTodo = async () => {
          try {
            const response = await fetch(`http://localhost:9090/todos`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                taskName: taskName,
                priority: prioString,
                dueDate: date,
              }),
            });
            if (response.ok) {
              const data = await response.json(); // Si la respuesta es exitosa, procesamos la respuesta
              console.log("Operación exitosa:", data);
              setTaskName("");
              setPrio(1);
              reload();
              onClose();
            } else {
              console.error("Error en la respuesta:", response.statusText);
            }
          } catch (error) {
            console.error("Error al realizar la operacion:", error);
          }
        };
        createTodo();
      } else {
        //Edit todo
        if (todoId) {
          const editTodo = async () => {
            try {
              const response = await fetch(
                `http://localhost:9090/todos/${todoId}`,
                {
                  method: "put",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    taskName: taskName,
                    priority: prioString,
                    dueDate: date,
                  }),
                }
              );
              if (response.ok) {
                const data = await response.json(); // Si la respuesta es exitosa, procesamos la respuesta
                console.log("Operación exitosa:", data);
                reload();
                onClose();
              } else {
                console.error("Error en la respuesta:", response.statusText);
              }
            } catch (error) {
              console.error("Error al realizar la operacion:", error);
            }
          };
          editTodo();
        }
      }
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show modal-lg"
        id="exampleModal"
        style={{ display: "block" }}
        //tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {mode == true ? "Create To-do" : "Edit To-do"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form className="">
                <div className="row mb-3">
                  <label
                    htmlFor="inputName"
                    className="col-sm-2 col-form-label"
                  >
                    Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="inputName"
                      value={taskName}
                      onChange={(e) => {
                        setTaskName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="selectPriority"
                    className="col-sm-2 col-form-label"
                  >
                    Priority
                  </label>
                  <div className="col-sm-4">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={prio}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setPrio(parseInt(e.target.value));
                      }}
                    >
                      <option value="1">High</option>
                      <option value="2">Medium</option>
                      <option value="3">Low</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3 ">
                  <label
                    htmlFor="selectState"
                    className="col-sm-2 col-form-label"
                  >
                    Due date
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="date"
                      id="datePicker"
                      name="due-date"
                      min={today}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                    />
                    <button
                      className="btn btn-danger"
                      style={{ marginLeft: "10px" }}
                      type="button"
                      onClick={handleDateClick}
                    >
                      Clear date
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={todoEditAdd}
              >
                {mode == true ? "Create" : "Edit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoEditModal;
