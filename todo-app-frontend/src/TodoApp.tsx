//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import FilterBox from "./components/FilterBox";
import TodoTable from "./components/TodoTable";
import "./App.css";
import { useEffect, useState } from "react";
import PaginationMenu from "./components/PaginationMenu";
import TodoEditModal from "./components/TodoEditModal";
import Metrics from "./components/Metrics";

function TodoApp() {
  //const [count, setCount] = useState(0)
  const [todoList, setTodo] = useState([]);
  const [pages, setPages] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);
  const [recharge, setRecharge] = useState(true);
  const [reloadMetrics, setReloadMetrics] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [prioFilter, setPrioFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  //const [totalPaginas, setTo talPaginas] = useState(0);
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
    console.log(i);
    setPaginaActual(i);
  };

  const handleSortSelection = (field: string, order: string) => {
    if (field == "") {
      setSortField("");
    } else {
      setSortField(field);
    }

    setSortOrder(order);
    //handleRecharge();
  };

  const handleRecharge = () => {
    setRecharge((prev) => !prev);
    console.log("recargado " + recharge);
  };

  const handleMetricsReload = () => {
    setReloadMetrics((prev) => !prev);
    console.log("recargado " + reloadMetrics);
  };

  useEffect(
    () => {
      const fetchUsuarios = async () => {
        try {
          const response = await fetch(
            //`http://localhost:9090/todos?page=${paginaActual}`
            `http://localhost:9090/todos?page=${paginaActual}&s=${stateFilter}&p=${prioFilter}&n=${nameFilter}&sort=${sortField}&order=${sortOrder}`
          );
          const data = await response.json();
          //console.log(data);
          setPages(data.totalPages);
          setTodo(data.content); // Asumiendo que 'content' tiene los usuarios
          //setTotalPaginas(data.totalPages); // Asumiendo que 'totalPages' tiene el número total de páginas
        } catch (error) {
          console.error("Error al obtener los usuarios:", error);
        }
      };

      fetchUsuarios();
    },
    [paginaActual, recharge, sortOrder, sortField] // [paginaActual]); // Se vuelve a llamar cuando cambia la página actual
  );

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:9090/todo/metrics`);
        const data = await response.json();
        console.log(data);
        setMetricStats(data);
        //setTotalPaginas(data.totalPages); // Asumiendo que 'totalPages' tiene el número total de páginas
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
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
