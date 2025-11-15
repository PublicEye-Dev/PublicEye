import "./UsersList.css";
import { useUserAdminStore } from "../../Store/userAdminStore";
import type { FormEvent } from "react";
import type { Role } from "../../Types/auth";
import { useShallow } from "zustand/react/shallow";

const roleOptions: Array<{ label: string; value: Role | "ALL" }> = [
  { label: "Toate rolurile", value: "ALL" },
  { label: "Admini", value: "ADMIN" },
  { label: "Operatori", value: "OPERATOR" },
  { label: "Cetățeni", value: "USER" },
];

const sortDirOptions: Array<{ label: string; value: "ASC" | "DESC" }> = [
  { label: "A-Z", value: "ASC" },
  { label: "Z-A", value: "DESC" },
];

export default function UsersListFilters() {
  const {
    roleFilter,
    setRoleFilter,
    searchTerm,
    setSearchTerm,
    submitSearch,
    resetSearch,
    sortDir,
    setSortDir,
  } = useUserAdminStore(
    useShallow((state) => ({
      roleFilter: state.roleFilter,
      setRoleFilter: state.setRoleFilter,
      searchTerm: state.searchTerm,
      setSearchTerm: state.setSearchTerm,
      submitSearch: state.submitSearch,
      resetSearch: state.resetSearch,
      sortDir: state.sortDir,
      setSortDir: state.setSortDir,
    }))
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitSearch();
  };

  return (
    <div className="users-list-actions">
      <form className="users-search-form" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Caută după nume sau email..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Caută</button>
        <button type="button" onClick={() => void resetSearch()}>
          Resetează
        </button>
      </form>

      <select
        className="users-filter-select"
        value={roleFilter}
        onChange={(event) =>
          setRoleFilter(event.target.value as Role | "ALL")
        }
      >
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="users-filter-select"
        value={sortDir}
        onChange={(event) =>
          setSortDir(event.target.value as "ASC" | "DESC")
        }
      >
        {sortDirOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sortare: {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

