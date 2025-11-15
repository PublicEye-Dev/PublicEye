import { useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import ReportsListFilters from "../../Components/ReportsList/ReportsListFilters";
import ReportsListTable from "../../Components/ReportsList/ReportsListTable";
import ReportsListPagination from "../../Components/ReportsList/ReportsListPagination";
import { useReportAdminStore } from "../../Store/reportAdminStore";
import "./ViewAllReportsPage.css";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

export default function ViewAllReportsPage() {
  const navigate = useNavigate();
  const {
    fetchReports,
    reports,
    isLoading,
    error,
    page,
    totalPages,
    totalElements,
    size,
    setPage,
    setPageSize,
    searchResults,
    isSearching,
  } = useReportAdminStore(
    useShallow((state) => ({
      fetchReports: state.fetchReports,
      reports: state.reports,
      isLoading: state.isLoading,
      error: state.error,
      page: state.page,
      totalPages: state.totalPages,
      totalElements: state.totalElements,
      size: state.size,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      searchResults: state.searchResults,
      isSearching: state.isSearching,
    }))
  );

  useEffect(() => {
    fetchReports().catch(() => undefined);
  }, [fetchReports]);

  const displayedReports = isSearching && searchResults !== null ? searchResults : reports;

  return (
    <div className="view-all-reports-page">
      <header className="view-all-reports-header">
        <Navbar />
      </header>

      <main className="view-all-reports-content">
        <div className="reports-list-header">
          <div>
            <p className="reports-page-kicker">Gestionare sesizări</p>
            <h1>Toate sesizările depuse de cetățeni</h1>
            <p>
              Vizualizează, filtrează și urmărește statusul sesizărilor din municipiul Timișoara.
            </p>
          </div>

          <ReportsListFilters />
        </div>

        <ReportsListTable
          reports={displayedReports}
          isLoading={isLoading}
          error={error}
          isSearching={isSearching}
          onViewDetails={(id) => navigate(`/administrare-sesizare/${id}`)}
        />

        {!isSearching && (
          <ReportsListPagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={size}
            onPageChange={(nextPage) => setPage(nextPage)}
            onSizeChange={(nextSize) => setPageSize(nextSize)}
            isDisabled={isLoading}
          />
        )}
      </main>
    </div>
  );
}

