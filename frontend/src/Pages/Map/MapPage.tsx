import { useEffect, useMemo } from "react";
import TimisoaraMap from "../../Components/Map/TimisoaraMap";
import "./MapPage.css";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import ReportsFilter from "../../Components/ReportsFilter/ReportsFilter";
import { useNavigate } from "react-router-dom";
import { useReportStore } from "../../Store/reportStore";
import { reportToIssues } from "../../Utils/reportHelpers";
import type { ReportIssue } from "../../Types/report";
import AddReportButton from "../../Components/AddReportButton/AddReportButton";

export default function MapPage() {
  const navigate = useNavigate();

  const { reports, isLoading, error, fetchReports } = useReportStore();

  //incarca sesizarile cand componenta se monteaza
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  //converteste Report[] in ReportIssue[] pt harta
  const issues: ReportIssue[] = useMemo(() => {
    return reportToIssues(reports);
  }, [reports]);

  //user apasa pe markerul unei sesizari
  const handleMarkerClick = (issueId: string) => {
    navigate(`/report/${issueId}`); //navigheaza la pagina detalii sesizare
  };

  return (
    <div className="map-page">
      <header className="map-page-header">
        <Navbar />
      </header>

      <section className="map-page-content">
        <TimisoaraMap issues={issues} onMarkerClick={handleMarkerClick} />
        <ReportsFilter />
        <AddReportButton />
      </section>

      {error && <div className="map-page-error">{error}</div>}
      {isLoading && (
        <div className="map-page-loading">Se încarcă sesizările...</div>
      )}
    </div>
  );
}
