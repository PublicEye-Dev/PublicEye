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
import { useNavigate } from "react-router-dom";

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
  const [isLoadingAlerte, setIsLoadingAlerte] = useState(false);
  const [alerteError, setAlerteError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectLocationMode, setSelectLocationMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectError, setSelectError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  // Încarcă sesizările și alertele simultan
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingAlerte(true);
      setAlerteError(null);
      try {
        const alerteData = await getAlerte();
        setAlerte(alerteData);
        await fetchReports();
      } catch (err) {
        setAlerteError(
          err instanceof Error ? err.message : "Eroare la încărcarea alertelor"
        );
      } finally {
        setIsLoadingAlerte(false);
      }
    };
    fetchData();
  }, [fetchReports]);

  // Obține locația curentă ca placeholder
  useEffect(() => {
    if (!isAddModalOpen) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setCurrentLocation(null);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [isAddModalOpen]);

  // conversie Report[] in ReportIssue[] pt hartă
  const issues: ReportIssue[] = useMemo(() => {
    return reportsToIssues(reports);
  }, [reports]);

  const startCreateFlow = () => {
    setIsAddModalOpen(true);
    setSelectLocationMode(false);
    setSelectedLocation(null);
    setSelectError(null);
  };

  const chooseWithoutLocation = () => {
    setIsAddModalOpen(false);
    navigate("/adauga-sesizare");
  };

  const chooseWithLocation = () => {
    setSelectLocationMode(true);
    setSelectError("Apasă pe hartă pentru a alege locația în Timișoara.");
  };

  const handleSelectLocation = (coords: { lat: number; lng: number }) => {
    // ajunge aici doar dacă punctul este în interior (validarea e în TimisoaraMap)
    setSelectedLocation(coords);
    setSelectError(null);
    setIsAddModalOpen(false);
    setSelectLocationMode(false);
    // navighează la formular cu coordonate presetate în query
    navigate(`/adauga-sesizare?lat=${coords.lat}&lng=${coords.lng}`);
  };

  return (
    <div className="map-page">
      <header className="map-page-header">
        <Navbar />
      </header>

      <section className="map-page-content">
        <TimisoaraMap
          issues={issues}
          alerte={alerte}
          selectLocationMode={selectLocationMode}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
        />
        <ReportsFilter />
        <AddReportButton onStartCreate={startCreateFlow} />

        {(selectedReport || isLoadingDetails || detailsError) && (
          <ReportDetailsDrawer
            report={selectedReport}
            isLoading={isLoadingDetails}
            error={detailsError}
            onClose={() => selectReport(null)}
          />
        )}

        {/* Modal jos pentru alegere mod creare sesizare */}
        {isAddModalOpen && (
          <div className="pe-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="pe-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="pe-handle" />
              <div className="pe-modal-header">
                <h3>Adaugă sesizare</h3>
              </div>
              <p className="pe-modal-desc">Alege cum vrei să depui sesizarea.</p>
              <div className="pe-modal-actions">
                <button className="pe-btn" onClick={chooseWithoutLocation}>Fără locație</button>
                <button className="pe-btn pe-btn-primary" onClick={chooseWithLocation}>Cu locație</button>
              </div>
              {currentLocation && (
                <p className="pe-small-note">
                  Locație curentă: {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
                </p>
              )}
              {selectError && <p className="pe-warning">{selectError}</p>}
              {selectLocationMode && (
                <p className="pe-small-note">
                  Apasă pe hartă în interiorul municipiului pentru a confirma locația. Dacă dai click în afara limitelor, locația nu va fi acceptată.
                </p>
              )}
            </div>
          </div>
        )}
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
