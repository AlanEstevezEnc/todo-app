import { useState } from "react";

//import { useEffect, useState } from "react";
interface Props {
  pageCount: number;
  paginaActual: number;
  onSelect: (i: number) => void;
}

function PaginationMenu({ pageCount, paginaActual, onSelect }: Props) {
  const nextPage = () => {
    if (paginaActual + 1 < pageCount) {
      onSelect(paginaActual + 1);
    }
  };

  const previousPage = () => {
    if (paginaActual + 1 > 1) {
      onSelect(paginaActual - 1);
    }
  };

  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a className="page-link" href="#" onClick={previousPage}>
              Previous
            </a>
          </li>
          {Array.from({ length: pageCount }).map((_, index) => (
            //<RepeatedComponent key={index} />
            <li
              className={"page-item " + (index == paginaActual ? "active" : "")}
              style={{ cursor: "pointer" }}
              key={index}
            >
              <a className="page-link" onClick={() => onSelect(index)}>
                {index + 1}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a className="page-link" href="#" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default PaginationMenu;
