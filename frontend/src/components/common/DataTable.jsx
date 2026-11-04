
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "./DataTable.css";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No hay registros disponibles.",
  rowKey = "id",
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  maxHeight = "450px"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Reiniciar la página cuando cambien los datos
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Cálculos de paginación
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = data.slice(startIndex, endIndex);

  const firstItem = totalItems === 0 ? 0 : startIndex + 1;
  const lastItem = Math.min(endIndex, totalItems);

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previous) =>
      Math.min(previous + 1, totalPages)
    );
  };

  if (loading) {
    return (
      <div className="data-table-message">
        Cargando información...
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="data-table-message">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">

      <div className="data-table-container" style={{ maxHeight }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentData.map((row, index) => (
              <tr key={row[rowKey] ?? index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-table-pagination">

        <div className="data-table-pagination-info">
          <span>
            Mostrando {firstItem}–{lastItem} de {totalItems} registros
          </span>

          <select value={itemsPerPage} onChange={handlePageSizeChange}
            aria-label="Registros por página">
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>

        <div className="data-table-pagination-controls">

          <button type="button" onClick={handlePreviousPage}
            disabled={currentPage === 1} title="Página anterior">
            <ChevronLeft size={17} />
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button type="button" onClick={handleNextPage}
            disabled={currentPage >= totalPages} title="Página siguiente">
            <ChevronRight size={17} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default DataTable;
