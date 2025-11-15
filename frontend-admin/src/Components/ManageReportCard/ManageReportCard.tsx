
import { IoSaveOutline, IoTrashOutline, IoMailOutline } from 'react-icons/io5';
import { useEffect, useMemo, useState } from 'react';
import './ManageReportCard.css';
import type { Status } from '../../Types/report';
import { deleteReport, getReportById, updateReportStatus } from '../../Services/reportService';
import type { Report } from '../../Types/report';
import { useNavigate } from 'react-router-dom';

interface ManageReportCardProps {
  reportId?: number;
}

const statusOptions: Status[] = [
  "DEPUSA",
  "PLANIFICATA",
  "IN_LUCRU",
  "REDIRECTIONATA",
  "REZOLVATA",
];

const statusLabels: Record<Status, string> = {
  DEPUSA: "Depusă",
  PLANIFICATA: "Planificată",
  IN_LUCRU: "În lucru",
  REDIRECTIONATA: "Redirecționată",
  REZOLVATA: "Rezolvată",
};

const ManageReportCard = ({ reportId }: ManageReportCardProps) => {
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status>("DEPUSA");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setError("ID-ul sesizării lipsește din URL.");
      setIsLoading(false);
      return;
    }

    const loadReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await getReportById(reportId);
        setReport(details);
        setSelectedStatus(details.status);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nu s-au putut încărca detaliile sesizării."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadReport();
  }, [reportId]);

  const formattedDate = useMemo(() => {
    if (!report?.createdAt) return "-";
    return new Date(report.createdAt).toLocaleString("ro-RO", {
      dateStyle: "long",
      timeStyle: "short",
    });
  }, [report?.createdAt]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value as Status);
  };

  const handleSaveStatus = async () => {
    if (!reportId) return;
    setIsUpdatingStatus(true);
    setError(null);
    try {
      const updated = await updateReportStatus(reportId, selectedStatus);
      setReport(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nu s-a putut actualiza statusul sesizării."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteReport = () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    if (!reportId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteReport(reportId);
      navigate("/sesizari");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nu s-a putut șterge sesizarea. Verifică dacă există endpoint-ul DELETE în backend."
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => setShowDeleteModal(false);

  const handleMailDepartment = () => {
    // TODO: conectare la endpoint când va fi disponibil
    console.log("Trimite mail departamentului...");
  };

  if (isLoading) {
    return (
      <div className="report-card-container">
        <p>Se încarcă detaliile sesizării...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-card-container">
        <p style={{ color: "#dc2626" }}>{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-card-container">
        <p>Sesizarea nu a fost găsită.</p>
      </div>
    );
  }

  return (
    <div className="report-card-container">
      <div className="report-details-section">
        <h3>Detalii Sesizare</h3>
        <ul>
          <li><strong>ID:</strong> #{report.id}</li>
          <li><strong>Categorie:</strong> {report.categoryName ?? "Categorie necunoscută"}</li>
          <li><strong>Status curent:</strong> {statusLabels[report.status]}</li>
          <li><strong>Dată creare:</strong> {formattedDate}</li>
          <li><strong>Locație:</strong> lat {report.latitude}, lng {report.longitude}</li>
          <li><strong>Descriere:</strong> <p>{report.description}</p></li>
        </ul>
      </div>

      <div className="report-actions-section">
        <div className="status-control">
          <label htmlFor="status-select">Actualizează statusul</label>
          <div className="status-action-group">
            <select
              id="status-select"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="status-dropdown"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {statusLabels[option]}
                </option>
              ))}
            </select>

            <button
              className="save-button"
              onClick={handleSaveStatus}
              disabled={isUpdatingStatus}
            >
              <IoSaveOutline className="button-icon-small" />{" "}
              {isUpdatingStatus ? "Se salvează..." : "Salvează"}
            </button>
          </div>
        </div>

        <button
          className="delete-button"
          onClick={handleDeleteReport}
          disabled={isDeleting}
        >
          <IoTrashOutline className="button-icon" />{" "}
          {isDeleting ? "Se șterge..." : "Șterge Sesizare"}
        </button>

        <button className="mail-button" onClick={handleMailDepartment}>
          <IoMailOutline className="button-icon" /> Mail Departament
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirmă ștergerea</h3>
            <p>
              Ești sigur că vrei să ștergi această sesizare? Datele șterse nu mai pot fi recuperate.
            </p>
            <div className="modal-actions">
              <button
                className="modal-button confirm-delete"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                Șterge
              </button>
              <button
                className="modal-button cancel-delete"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReportCard;