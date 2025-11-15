import { useCallback, useEffect, useState } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./AdminPetitionsListPage.css";
import {
  fetchAdminPetitions,
  type AdminPetitionQuery,
} from "../../Services/petitionService";
import type { Petition } from "../../Types/petition";
import PetitionsListFilters from "../../Components/PetitionsList/PetitionsListFilters";
import PetitionsListTable from "../../Components/PetitionsList/PetitionsListTable";
import ReportsListPagination from "../../Components/ReportsList/ReportsListPagination";

const DEFAULT_QUERY: AdminPetitionQuery = {
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDir: "DESC",
  status: "ALL",
};

export default function AdminPetitionsListPage() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [query, setQuery] = useState<AdminPetitionQuery>(DEFAULT_QUERY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadPetitions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAdminPetitions(query);
      setPetitions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nu s-au putut încărca petițiile."
      );
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadPetitions();
  }, [loadPetitions]);

  const handleStatusChange = (status: string) => {
    setQuery((prev) => ({ ...prev, status }));
  };

  const handleCreatedAfterChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      createdAfter: value ? `${value}T00:00:00` : undefined,
    }));
  };

  const handleCreatedBeforeChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      createdBefore: value ? `${value}T23:59:59` : undefined,
    }));
  };

  const handleSortByChange = (value: string) => {
    setQuery((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSortDirChange = (value: "ASC" | "DESC") => {
    setQuery((prev) => ({ ...prev, sortDir: value }));
  };

  const handleClearDates = () => {
    setQuery((prev) => ({
      ...prev,
      createdAfter: undefined,
      createdBefore: undefined,
    }));
  };

  return (
    <div className="view-all-reports-page">
      <div className="page-navbar">
        <Navbar />
      </div>
      <div className="view-all-reports-content">
        <p className="reports-page-kicker">Administrare</p>
        <h1>Petiții primite</h1>
        <p>Vizualizează și gestionează petițiile trimise de cetățeni.</p>

        <PetitionsListFilters
          status={query.status ?? "ALL"}
          createdAfter={query.createdAfter?.split("T")[0] ?? ""}
          createdBefore={query.createdBefore?.split("T")[0] ?? ""}
          sortBy={query.sortBy ?? "createdAt"}
          sortDir={query.sortDir ?? "DESC"}
          onStatusChange={handleStatusChange}
          onCreatedAfterChange={handleCreatedAfterChange}
          onCreatedBeforeChange={handleCreatedBeforeChange}
          onSortByChange={handleSortByChange}
          onSortDirChange={handleSortDirChange}
          onApplyFilters={() => {
            setQuery((prev) => ({ ...prev, page: 0 }));
          }}
          onClearDates={handleClearDates}
        />

        <PetitionsListTable
          petitions={petitions}
          isLoading={isLoading}
          error={error}
        />

        {totalElements > 0 && (
          <ReportsListPagination
            page={query.page ?? 0}
            totalPages={totalPages}
            size={query.size ?? 10}
            totalElements={totalElements}
            onPageChange={(value) =>
              setQuery((prev) => ({ ...prev, page: value }))
            }
            onSizeChange={(value) =>
              setQuery((prev) => ({ ...prev, size: value, page: 0 }))
            }
            isDisabled={isLoading}
            entityLabel="petiții"
          />
        )}
      </div>
    </div>
  );
}

