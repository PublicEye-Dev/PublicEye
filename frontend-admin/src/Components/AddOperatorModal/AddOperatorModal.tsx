import { useEffect, useState, type FormEvent } from "react";
import { FaTimes } from "react-icons/fa";
import "./AddOperatorModal.css";
import { useDepartmentStore } from "../../Store/departmentStore";

interface AddOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddOperatorModal({
  isOpen,
  onClose,
}: AddOperatorModalProps) {
  const {
    addOperator,
    availableDepartments,
    refreshAvailableDepartments,
    availableLoading,
    isSaving,
    error,
    resetError,
  } = useDepartmentStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      void refreshAvailableDepartments();
    }
  }, [isOpen, refreshAvailableDepartments]);

  if (!isOpen) {
    return null;
  }

  const handleContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleClose = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setDepartmentId("");
    setLocalError(null);
    resetError();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setLocalError("Completează toate câmpurile obligatorii.");
      return;
    }
    if (!departmentId) {
      setLocalError("Selectează un departament.");
      return;
    }

    try {
      await addOperator({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        departmentId: Number(departmentId),
      });
      handleClose();
    } catch {
      // error already set
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h3>Adaugă operator oficial</h3>
          <button className="modal-close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form className="department-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="operator-name">Nume complet</label>
              <input
                id="operator-name"
                type="text"
                placeholder="ex: Andrei Popescu"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="operator-email">Email</label>
              <input
                id="operator-email"
                type="email"
                autoComplete="email"
                placeholder="ex: andrei.popescu@primaria.ro"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="operator-password">Parolă</label>
              <input
                id="operator-password"
                type="password"
                autoComplete="current-password"
                placeholder="Parolă minim 8 caractere"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="operator-dept">Departament</label>
              <select
                id="operator-dept"
                value={departmentId}
                onChange={(event) =>
                  setDepartmentId(
                    event.target.value ? Number(event.target.value) : ""
                  )
                }
              >
                <option value="">
                  {availableLoading
                    ? "Se încarcă..."
                    : "Selectează un departament"}
                </option>
                {availableDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {(localError || error) && (
              <p className="modal-error">{localError ?? error}</p>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="button-cancel"
              onClick={handleClose}
              disabled={isSaving}
            >
              Anulează
            </button>
            <button type="submit" className="button-save" disabled={isSaving}>
              {isSaving ? "Se salvează..." : "Adaugă operator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

