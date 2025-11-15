import "./DeleteDepartmentModal.css";
import type { Department } from "../../Types/department";

interface DeleteDepartmentModalProps {
  department: Department | null;
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDepartmentModal({
  department,
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteDepartmentModalProps) {
  if (!isOpen || !department) {
    return null;
  }

  return (
    <div className="dept-modal-overlay">
      <div className="dept-modal">
        <h3>Ștergi departamentul?</h3>
        <p>
          Departamentul <strong>{department.name}</strong> va fi eliminat, iar
          operatorul asociat acestuia va fi șters automat din sistem.
        </p>
        <p className="dept-modal-warning">
          Această acțiune nu poate fi anulată.
        </p>
        <div className="dept-modal-actions">
          <button
            type="button"
            className="dept-modal-btn cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Anulează
          </button>
          <button
            type="button"
            className="dept-modal-btn confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Se șterge..." : "Șterge departamentul"}
          </button>
        </div>
      </div>
    </div>
  );
}

