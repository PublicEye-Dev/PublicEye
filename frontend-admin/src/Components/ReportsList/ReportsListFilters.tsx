import type { FormEvent } from "react";
import "./ReportsList.css";
import { useReportAdminStore } from "../../Store/reportAdminStore";
import type { Status } from "../../Types/report";
import { useShallow } from "zustand/react/shallow";

const statusOptions: Array<{ label: string; value: Status | "ALL" }> = [
  { label: "Toate statusurile", value: "ALL" },
  { label: "Depuse", value: "DEPUSA" },
  { label: "Planificate", value: "PLANIFICATA" },
  { label: "În lucru", value: "IN_LUCRU" },
  { label: "Redirecționate", value: "REDIRECTIONATA" },
  { label: "Rezolvate", value: "REZOLVATA" },
];

const sortFieldOptions: Array<{ label: string; value: string }> = [
  { label: "Dată depunere", value: "createdAt" },
  { label: "Număr voturi", value: "votes" },
];

const sortDirOptions: Array<{ label: string; value: "ASC" | "DESC" }> = [
  { label: "Ascendent", value: "ASC" },
  { label: "Descendent", value: "DESC" },
];

export default function ReportsListFilters() {
  const {
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    executeSearch,
    clearSearch,
    isSearching,
    sortBy,
    sortDir,
    setSort,
  } = useReportAdminStore(
    useShallow((state) => ({
      statusFilter: state.statusFilter,
      setStatusFilter: state.setStatusFilter,
      searchTerm: state.searchTerm,
      setSearchTerm: state.setSearchTerm,
      executeSearch: state.executeSearch,
      clearSearch: state.clearSearch,
      isSearching: state.isSearching,
      sortBy: state.sortBy,
      sortDir: state.sortDir,
      setSort: state.setSort,
    }))
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void executeSearch();
  };

  return (
    <div className="reports-list-actions">
      <form className="reports-search-form" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Caută după descriere, categorie, utilizator..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        {isSearching ? (
          <button type="button" onClick={() => void clearSearch()}>
            Resetează
          </button>
        ) : (
          <button type="submit">Caută</button>
        )}
      </form>

      <select
        className="reports-filter-select"
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as Status | "ALL")
        }
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="reports-filter-select"
        value={sortBy}
        onChange={(event) => setSort(event.target.value, sortDir)}
      >
        {sortFieldOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sortează după: {option.label}
          </option>
        ))}
      </select>

      <select
        className="reports-filter-select"
        value={sortDir}
        onChange={(event) =>
          setSort(sortBy, event.target.value as "ASC" | "DESC")
        }
      >
        {sortDirOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
