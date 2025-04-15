import FilterBox from "./components/FilterBox";
import TodoTable from "./components/TodoTable";
import "./App.css";
import { useEffect, useState } from "react";
import PaginationMenu from "./components/PaginationMenu";
import TodoEditModal from "./components/TodoEditModal";
import Metrics from "./components/Metrics";

function TodoApp() {
  const [todoList, setTodo] = useState([]);
  const [pages, setPages] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);
  const [recharge, setRecharge] = useState(true);
  const [reloadMetrics, setReloadMetrics] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [prioFilter, setPrioFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [sortField, setSortField] = useState("");
  const [metricStats, setMetricStats] = useState({
    lowAverage: "",
    midAverage: "",
    Average: "",
    highAverage: "",
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleFilterList = (
    filtroNombre: string,
    filtroPrio: string,
    filtroState: string
  ) => {
    if (filtroPrio === "All") {
      setPrioFilter("");
    } else {
      setPrioFilter(filtroPrio);
    }
    if (filtroState === "All") {
      setStateFilter("");
    } else {
      setStateFilter(filtroState);
    }

    setNameFilter(filtroNombre);
    setPaginaActual(0);
    setRecharge(!recharge);
  };

  const handleSelect = (i: number) => {
    setPaginaActual(i);
  };

  const handleSortSelection = (field: string, order: string) => {
    if (field == "") {
      setSortField("");
    } else {
      setSortField(field);
    }

    setSortOrder(order);
  };

  const handleRecharge = () => {
    setRecharge((prev) => !prev);
    setReloadMetrics((prev) => !prev);
  };

  const handleMetricsReload = () => {
    setReloadMetrics((prev) => !prev);
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(
          `http://localhost:9090/todos?page=${paginaActual}&s=${stateFilter}&p=${prioFilter}&n=${nameFilter}&sort=${sortField}&order=${sortOrder}`
        );
        const data = await response.json();
        //console.log(data);
        setPages(data.totalPages);
        setTodo(data.content);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsuarios();
  }, [paginaActual, recharge, sortOrder, sortField]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:9090/todo/metrics`);
        const data = await response.json();
        //console.log(data);
        setMetricStats(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMetrics();
  }, [reloadMetrics]);

  return (
    <>
      <div className="container">
        <FilterBox handleFilterList={handleFilterList}></FilterBox>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          Add new To-do
        </button>
        <TodoEditModal
          show={openModal}
          onClose={handleOpenModal}
          mode={true}
          reload={handleRecharge}
        />
        <TodoTable
          todoList={todoList}
          reload={handleRecharge}
          handleSortSelection={handleSortSelection}
          handleMetricsReload={handleMetricsReload}
        />
        <PaginationMenu
          pageCount={pages}
          paginaActual={paginaActual}
          onSelect={handleSelect}
        />
        <Metrics metricStats={metricStats} />
      </div>
    </>
  );
}

export default TodoApp;
