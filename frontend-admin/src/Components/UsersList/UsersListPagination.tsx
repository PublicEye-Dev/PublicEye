import "./UsersList.css";

interface UsersListPaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  isDisabled?: boolean;
}

export default function UsersListPagination({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  onSizeChange,
  isDisabled,
}: UsersListPaginationProps) {
  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <div className="users-pagination">
      <div className="page-indicator">
        Pagina {totalPages ? page + 1 : 0} din {totalPages || 0} • {totalElements} utilizatori
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <select
          className="users-filter-select"
          value={size}
          disabled={isDisabled}
          onChange={(event) => onSizeChange(Number(event.target.value))}
        >
          {[10, 20, 30, 50].map((option) => (
            <option key={option} value={option}>
              {option}/pag
            </option>
          ))}
        </select>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev || isDisabled}
        >
          Anterioară
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext || isDisabled}
        >
          Următoare
        </button>
      </div>
    </div>
  );
}

