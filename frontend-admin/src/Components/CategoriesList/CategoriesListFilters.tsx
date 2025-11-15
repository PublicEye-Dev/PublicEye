import "./CategoriesList.css";
import { useCategoryStore } from "../../Store/categoryStore";
import { useShallow } from "zustand/react/shallow";
import type { FormEvent } from "react";

interface CategoriesListFiltersProps {
  onAddCategory: () => void;
}

export default function CategoriesListFilters({
  onAddCategory,
}: CategoriesListFiltersProps) {
  const {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    departments,
    executeSearch,
    clearSearch,
    isSearching,
  } = useCategoryStore(
    useShallow((state) => ({
      searchTerm: state.searchTerm,
      setSearchTerm: state.setSearchTerm,
      departmentFilter: state.departmentFilter,
      setDepartmentFilter: state.setDepartmentFilter,
      departments: state.departments,
      executeSearch: state.executeSearch,
      clearSearch: state.clearSearch,
      isSearching: state.isSearching,
    }))
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void executeSearch();
  };

  const departmentOptions = departments ?? [];

  return (
    <div className="categories-actions">
      <form className="categories-filters" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Caută după nume categorie..."
          value={searchTerm ?? ""}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          value={
            departmentFilter === "ALL"
              ? "ALL"
              : departmentFilter !== undefined
              ? String(departmentFilter)
              : "ALL"
          }
          onChange={(event) =>
            setDepartmentFilter(
              event.target.value === "ALL"
                ? "ALL"
                : Number(event.target.value)
            )
          }
        >
          <option value="ALL">Toate departamentele</option>
          {departmentOptions.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        {isSearching ? (
          <button
            type="button"
            className="categories-search-button"
            onClick={() => clearSearch()}
          >
            Resetează
          </button>
        ) : (
          <button type="submit" className="categories-search-button">
            Caută
          </button>
        )}
      </form>
      <button className="add-category-button" onClick={onAddCategory}>
        Adaugă categorie
      </button>
    </div>
  );
}

