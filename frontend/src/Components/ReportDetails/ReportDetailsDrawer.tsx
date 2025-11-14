import "./ReportDetailsDrawer.css";
import type { Report } from "../../Types/report";
import { getStatusLabel } from "../../Utils/reportHelpers";
import { useReportStore } from "../../Store/reportStore";

interface ReportDetailsDrawerProps {
  report: Report | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export default function ReportDetailsDrawer({
  report,
  isLoading,
  error,
  onClose,
}: ReportDetailsDrawerProps) {
  const { voteReportById } = useReportStore();

  const handleVote = () => {
    if (!report) return;
    voteReportById(report.id);
  };

  return (
    <aside className="report-drawer">
      <button className="report-drawer-close" onClick={onClose}>
        ×
      </button>

      {isLoading && (
        <div className="report-drawer-state">
          <p>Se încarcă detaliile sesizării...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="report-drawer-state report-drawer-state--error">
          <p>{error}</p>
          <button onClick={onClose}>Închide</button>
        </div>
      )}

      {!isLoading && !error && report && (
        <>
          <header className="report-drawer-header">
            <div>
              <p className="report-drawer-label">Sesizare #{report.id}</p>
              <h2>{report.description}</h2>
            </div>
            <span
              className={`report-status report-status-${report.status.toLowerCase()}`}
            >
              {getStatusLabel(report.status)}
            </span>
          </header>

          <ul className="report-drawer-meta">
            <li>
              <strong>Voturi</strong>
              <span>{report.votes}</span>
            </li>
            <li>
              <strong>Latitudine</strong>
              <span>{report.latitude}</span>
            </li>
            <li>
              <strong>Longitudine</strong>
              <span>{report.longitude}</span>
            </li>
          </ul>

          {report.imageUrl && (
            <figure className="report-drawer-image">
              <img src={report.imageUrl} alt="Dovadă sesizare" />
            </figure>
          )}

          <footer className="report-drawer-footer">
            <button onClick={handleVote}>Susține această sesizare</button>
          </footer>
        </>
      )}
    </aside>
  );
}

