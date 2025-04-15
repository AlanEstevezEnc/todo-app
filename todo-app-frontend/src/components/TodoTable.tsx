import { useEffect, useState } from "react";
import TodoEditModal from "./TodoEditModal";

interface Props {
  todoList: todoItem[];
  reload: () => void;
  handleSortSelection: (sortField: string, sortOrder: string) => void;
  handleMetricsReload: () => void;
}

interface todoItem {
  id: number;
  taskName: string;
  priority: string;
  dueDate: string;
  todoState: boolean;
}

function TodoTable(props: Props) {
  const { todoList, reload, handleSortSelection, handleMetricsReload } = props;

  const [estados, setEstados] = useState<boolean[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [todoEdit, setTodoEdit] = useState(-1);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleEstados = (index: number, id: number) => {
    setEstados((ex) => {
      const nuevosEstados = [...ex];
      nuevosEstados[index] = !nuevosEstados[index];
      return nuevosEstados;
    });
    //Funciion
    setDoneUndone(index, id);
  };

  const handlePriority = () => {
    if (sortField == "" || sortField == "date") {
      setSortField("prio" + sortField);
    }

    if (sortOrder == "") {
      setSortOrder("asc");
    } else if (sortOrder == "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  const clearPriority = () => {
    setSortField(sortField.replace("prio", ""));
  };

  const handleDate = () => {
    if (sortField == "" || sortField == "prio") {
      setSortField(sortField + "date");
    }

    if (sortOrder == "") {
      setSortOrder("asc");
    } else if (sortOrder == "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  const clearDate = () => {
    setSortField(sortField.replace("date", ""));
  };

  useEffect(() => {
    handleSortSelection(sortField, sortOrder);
  }, [sortField, sortOrder]);

  const setDoneUndone = (index: number, id: number) => {
    //console.log(index);
    if (!estados[index]) {
      //console.log("truers");
      const DoneTodo = async () => {
        try {
          const response = await fetch(
            `http://localhost:9090/todos/${id + 1}/done`,
            {
              method: "put",
            }
          );
          if (response.ok) {
            const data = await response.json(); // Si la respuesta es exitosa, procesamos la respuesta
            console.log("Success:", data);
            handleMetricsReload();
          } else {
            console.error("Response error:", response.statusText);
          }
        } catch (error) {
          console.error("Server error:", error);
        }
      };
      DoneTodo();
    } else {
      const unDoneTodo = async () => {
        try {
          const response = await fetch(
            `http://localhost:9090/todos/${id + 1}/undone`,
            {
              method: "put",
            }
          );
          if (response.ok) {
            const data = await response.json(); // Si la respuesta es exitosa, procesamos la respuesta
            console.log("Success:", data);
            handleMetricsReload();
          } else {
            console.error("Response error:", response.statusText);
          }
        } catch (error) {
          console.error("Server error:", error);
        }
      };

      unDoneTodo();
    }

    //reload();
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete?")) {
      const deleteTodo = async () => {
        try {
          const response = await fetch(`http://localhost:9090/todos?id=${id}`, {
            method: "delete",
          });
          if (response.ok) {
            console.log("Success:", response);
            reload();
            handleMetricsReload();
          } else {
            console.error("Response error:", response.statusText);
          }
        } catch (error) {
          console.error("Server error:", error);
        }
      };
      deleteTodo();
    }
  };

  useEffect(() => {
    const tempList = todoList.map((x) => x.todoState);
    setEstados(tempList);
  }, [todoList]);

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">State</th>
            <th scope="col">Name</th>
            <th
              scope="col"
              onClick={handlePriority}
              onDoubleClick={clearPriority}
              style={{ cursor: "pointer" }}
            >
              Priority
              {sortField == "prio" || sortField == "priodate"
                ? sortOrder == "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </th>
            <th
              scope="col"
              onClick={handleDate}
              onDoubleClick={clearDate}
              style={{ cursor: "pointer" }}
            >
              Due date
              {sortField == "date" || sortField == "priodate"
                ? sortOrder == "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todoList.map((elemento, index) => (
            <tr
              key={elemento.id}
              className={estados[index] === true ? "strikethrough" : ""}
            >
              <th scope="row">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={index}
                    id={`${elemento.id}`}
                    checked={estados[index]}
                    onChange={() => handleEstados(index, elemento.id - 1)}
                  />
                </div>
              </th>
              <td>{elemento.taskName}</td>
              <td>{elemento.priority}</td>
              <td>{elemento.dueDate}</td>
              <td className="">
                <button
                  className="btn btn-primary" //onClick={handleOpenModal}>
                  onClick={() => {
                    setTodoEdit(elemento.id);
                    //console.log("Todo id: " + todoId);
                    handleOpenModal();
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleDelete(elemento.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TodoEditModal
        show={openModal}
        onClose={handleOpenModal}
        mode={false}
        todoId={todoEdit}
        reload={reload}
      />
    </>
  );
}

export default TodoTable;
