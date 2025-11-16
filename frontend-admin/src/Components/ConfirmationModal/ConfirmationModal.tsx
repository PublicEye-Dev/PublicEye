import "./ConfirmationModal.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title = "Confirmare",
  message,
  confirmLabel = "Confirmă",
  cancelLabel = "Anulează",
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirmation-overlay" onClick={onCancel}>
      <div
        className="confirmation-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirmation-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="button-danger"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Se procesează..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
