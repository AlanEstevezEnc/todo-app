//import { useEffect, useState } from "react";
interface Props {
  pageCount: number;
  paginaActual: number;
  onSelect: (i: number) => void;
}

function PaginationMenu({ pageCount, paginaActual, onSelect }: Props) {
  //const activo = "active";
  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a className="page-link" href="#">
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
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default PaginationMenu;
