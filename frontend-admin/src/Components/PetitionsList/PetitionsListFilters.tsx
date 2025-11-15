import "./PetitionsList.css";

interface PetitionsListFiltersProps {
  status: string;
  createdAfter: string;
  createdBefore: string;
  sortBy: string;
  sortDir: "ASC" | "DESC";
  onStatusChange: (value: string) => void;
  onCreatedAfterChange: (value: string) => void;
  onCreatedBeforeChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortDirChange: (value: "ASC" | "DESC") => void;
  onApplyFilters: () => void;
  onClearDates: () => void;
}

const statusOptions = [
  { label: "Toate statusurile", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Închise", value: "CLOSED" },
  { label: "Blocate", value: "BANNED" },
];

const sortFieldOptions = [
  { label: "Dată creare", value: "createdAt" },
  { label: "Număr voturi", value: "votes" },
  { label: "Titlu", value: "title" },
];

const sortDirOptions: Array<{ label: string; value: "ASC" | "DESC" }> = [
  { label: "Ascendent", value: "ASC" },
  { label: "Descendent", value: "DESC" },
];

export default function PetitionsListFilters({
  status,
  createdAfter,
  createdBefore,
  sortBy,
  sortDir,
  onStatusChange,
  onCreatedAfterChange,
  onCreatedBeforeChange,
  onSortByChange,
  onSortDirChange,
  onApplyFilters,
  onClearDates,
}: PetitionsListFiltersProps) {
  const handleResetDates = () => {
    onCreatedAfterChange("");
    onCreatedBeforeChange("");
    onClearDates();
  };

  return (
    <div className="petitions-filters">
      <div className="petitions-filter-group">
        <label>Status</label>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="petitions-filter-group">
        <label>De la data</label>
        <input
          type="date"
          value={createdAfter}
          onChange={(event) => onCreatedAfterChange(event.target.value)}
        />
      </div>

      <div className="petitions-filter-group">
        <label>Până la data</label>
        <input
          type="date"
          value={createdBefore}
          onChange={(event) => onCreatedBeforeChange(event.target.value)}
        />
      </div>

      <div className="petitions-filter-group">
        <label>Sortează după</label>
        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          {sortFieldOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="petitions-filter-group">
        <label>Ordine</label>
        <select
          value={sortDir}
          onChange={(event) =>
            onSortDirChange(event.target.value as "ASC" | "DESC")
          }
        >
          {sortDirOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="petitions-filter-actions">
        <button type="button" onClick={onApplyFilters}>
          Aplică filtre
        </button>
        <button type="button" onClick={handleResetDates} className="link-btn">
          Resetează datele
        </button>
      </div>
    </div>
  );
}

