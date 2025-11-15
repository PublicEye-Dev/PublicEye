import "./ReportDetailsDrawer.css";
import type { Report } from "../../Types/report";
import { getStatusLabel } from "../../Utils/reportHelpers";
import { useReportStore } from "../../Store/reportStore";
import { useAuthStore } from "../../Store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

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
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const handleVote = () => {
    if (!report) return;
    if (!token) {
      navigate("/login?next=/");
      return;
    }
    voteReportById(report.id);
  };

  useEffect(() => {
    if (!report) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        event.target instanceof Node &&
        !drawerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [report, onClose]);

  return (
    <aside className="report-drawer" ref={drawerRef}>
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
              <p className="report-drawer-label">
                {report.categoryName || `Categorie #${report.categoryId}`}
              </p>
              <h2>Sesizare #{report.id}</h2>
            </div>
            <span
              className={`report-status report-status-${report.status.toLowerCase()}`}
            >
              {getStatusLabel(report.status)}
            </span>
          </header>

          <p className="report-drawer-description">{report.description}</p>

          <ul className="report-drawer-meta">
            <li>
              <span className="report-drawer-meta-label">Voturi</span>
              <span className="report-drawer-meta-value">{report.votes}</span>
            </li>
            <li>
              <span className="report-drawer-meta-label">Latitudine</span>
              <span className="report-drawer-meta-value">
                {report.latitude}
              </span>
            </li>
            <li>
              <span className="report-drawer-meta-label">Longitudine</span>
              <span className="report-drawer-meta-value">
                {report.longitude}
              </span>
            </li>
          </ul>

          {report.imageUrl && (
            <figure className="report-drawer-image">
              <img src={report.imageUrl} alt="Dovadă sesizare" />
            </figure>
          )}

          <footer className="report-drawer-footer">
            <div className="report-drawer-votes">
              <span className="report-drawer-votes-count">{report.votes}</span>
              <span className="report-drawer-votes-label">susținători</span>
            </div>
            <button onClick={handleVote}>Susține această sesizare</button>
          </footer>
        </>
      )}
    </aside>
  );
}
