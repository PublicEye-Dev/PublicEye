import { useEffect, useMemo } from "react";
import TimisoaraMap from "../../Components/Map/TimisoaraMap";
import "./MapPage.css";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import ReportsFilter from "../../Components/ReportsFilter/ReportsFilter";
import { useReportStore } from "../../Store/reportStore";
import { reportsToIssues } from "../../Utils/reportHelpers";
import type { ReportIssue } from "../../Types/report";
import AddReportButton from "../../Components/AddReportButton/AddReportButton";
import ReportDetailsDrawer from "../../Components/ReportDetails/ReportDetailsDrawer";

export default function MapPage() {
  const {
    reports,
    isLoading,
    error,
    fetchReports,
    selectedReport,
    selectReport,
    isLoadingDetails,
    detailsError,
  } = useReportStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const issues: ReportIssue[] = useMemo(() => {
    return reportsToIssues(reports);
  }, [reports]);

  return (
    <div className="map-page">
      <header className="map-page-header">
        <Navbar />
      </header>

      <section className="map-page-content">
        <TimisoaraMap issues={issues} />
        <ReportsFilter />
        <AddReportButton />

        {(selectedReport || isLoadingDetails || detailsError) && (
          <ReportDetailsDrawer
            report={selectedReport}
            isLoading={isLoadingDetails}
            error={detailsError}
            onClose={() => selectReport(null)}
          />
        )}
      </section>

      {error && <div className="map-page-error">{error}</div>}
      {isLoading && (
        <div className="map-page-loading">Se încarcă sesizările...</div>
      )}
    </div>
  );
}

