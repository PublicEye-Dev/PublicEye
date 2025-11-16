import { useEffect, useMemo, useState } from "react";
import TimisoaraMap from "../../Components/Map/TimisoaraMap";
import "./MapPage.css";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import ReportsFilter from "../../Components/ReportsFilter/ReportsFilter";
import { useReportStore } from "../../Store/reportStore";
import { reportsToIssues } from "../../Utils/reportHelpers";
import type { ReportIssue } from "../../Types/report";
import type { Alerta } from "../../Types/alert";
import AddReportButton from "../../Components/AddReportButton/AddReportButton";
import ReportDetailsDrawer from "../../Components/ReportDetails/ReportDetailsDrawer";
import { getAlerte } from "../../Services/reportService";

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

  const [alerte, setAlerte] = useState<Alerta[]>([]);
  const [selectedAlerta, setSelectedAlerta] = useState<Alerta | null>(null);
  const [isLoadingAlerte, setIsLoadingAlerte] = useState(false);
  const [alerteError, setAlerteError] = useState<string | null>(null);

  // Încarcă sesizările și alertele simultan
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingAlerte(true);
      setAlerteError(null);
      try {
        const alerteData = await getAlerte();
        console.log("Alerte încărcate:", alerteData.length, "alerte");
        console.log("Date alerte:", alerteData);
        setAlerte(alerteData);
        await fetchReports();
      } catch (err) {
        console.error("Eroare la încărcarea alertelor:", err);
        setAlerteError(
          err instanceof Error ? err.message : "Eroare la încărcarea alertelor"
        );
      } finally {
        setIsLoadingAlerte(false);
      }
    };
    fetchData();
  }, [fetchReports]);

  //converteste Report[] in ReportIssue[] pt harta
  const issues: ReportIssue[] = useMemo(() => {
    return reportsToIssues(reports);
  }, [reports]);

  return (
    <div className="map-page">
      <header className="map-page-header">
        <Navbar />
      </header>

      <section className="map-page-content">
        <TimisoaraMap
          issues={issues}
          alerte={alerte}
          onAlertaClick={setSelectedAlerta}
        />
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

        {/* Eliminat drawer-ul mare pentru alerte - folosim doar popup-ul mic pe hartă */}
        {/* {selectedAlerta && (
          <ReportDetailsDrawer
            report={{
              id: selectedAlerta.id,
              description: selectedAlerta.descriere,
              imageUrl: null,
              imagePublicId: null,
              votes: 0,
              status: "DEPUSA",
              latitude: selectedAlerta.latitude,
              longitude: selectedAlerta.longitude,
              categoryId: 0,
              categoryName: selectedAlerta.tipPericol,
              subcategoryId: 0,
              userId: 0,
              createdAt: selectedAlerta.createdAt,
            }}
            isLoading={false}
            error={null}
            onClose={() => setSelectedAlerta(null)}
          />
        )} */}
      </section>

      {error && <div className="map-page-error">{error}</div>}
      {alerteError && <div className="map-page-error">{alerteError}</div>}
      {(isLoading || isLoadingAlerte) && (
        <div className="map-page-loading">
          {isLoading ? "Se încarcă sesizările..." : "Se încarcă alertele..."}
        </div>
      )}
    </div>
  );
}
