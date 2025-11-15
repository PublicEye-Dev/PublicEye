import { useState, type FormEvent } from "react";
import { FaTimes } from "react-icons/fa";
import "./AddDepartmentModal.css";
import { useDepartmentStore } from "../../Store/departmentStore";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addDepartment, isSaving, error, resetError } = useDepartmentStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    resetError();
    setLocalError(null);
    resetError();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError("Introdu numele departamentului");
      return;
    }

    try {
      await addDepartment({
        name: name.trim(),
        description: description.trim(),
        categories: [],
      });
      handleClose();
    } catch {
      // error already set in store
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h3>Adaugă un departament nou</h3>
          <button className="modal-close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form className="department-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="dept-name">Nume departament</label>
              <input
                type="text"
                id="dept-name"
                placeholder="ex: Serviciul Urbanism"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dept-description">Descriere</label>
              <textarea
                id="dept-description"
                rows={4}
                placeholder="ex: Gestionează rapoartele de urbanism..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></textarea>
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
              {isSaving ? "Se salvează..." : "Salvează"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;