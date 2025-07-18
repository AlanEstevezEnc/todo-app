import { useState } from "react";

interface Props {
  handleFilterList: (
    filtroNombre: string,
    filtroPrio: string,
    filtroState: string
  ) => void;
}

function FilterBox({ handleFilterList }: Props) {
  //const [count, setCount] = useState(0)
  const [nameFilter, setNameFilter] = useState("");
  const [prioFilter, setPrioFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const handleSearch = () => {
    handleFilterList(nameFilter, prioFilter, stateFilter);
  };

  return (
    <>
      <form className="filterBox">
        <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">
            Name
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              id="inputName"
              onChange={(e) => {
                setNameFilter(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="selectPriority" className="col-sm-2 col-form-label">
            Priority
          </label>
          <div className="col-sm-4">
            <select
              id="selectPriority" // <-- Add this
              className="form-select"
              aria-label="Priority select"
              onChange={(e) => {
                setPrioFilter(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div className="row mb-3 ">
          <label htmlFor="selectState" className="col-sm-2 col-form-label">
            State
          </label>
          <div className="col-sm-4">
            <select
              id="selectState" // <-- Add this
              className="form-select"
              aria-label="State select"
              onChange={(e) => {
                setStateFilter(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="true">Done</option>
              <option value="false">Undone</option>
            </select>
          </div>
          <div className="col-sm-2 offset-md-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default FilterBox;
