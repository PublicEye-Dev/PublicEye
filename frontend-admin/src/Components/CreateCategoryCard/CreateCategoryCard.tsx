import { useState, type FormEvent } from "react";
import "./CreateCategoryCard.css";

interface DepartmentOption {
  id: number;
  name: string;
}

interface CreateCategoryCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { name: string; departmentId: number | null }) => Promise<void>;
  departments?: DepartmentOption[];
  isSubmitting: boolean;
  error: string | null;
}

const CreateCategoryCard: React.FC<CreateCategoryCardProps> = ({
  isOpen,
  onClose,
  onSave,
  departments,
  isSubmitting,
  error,
}) => {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const departmentOptions = departments ?? [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    if (!name.trim()) {
      setLocalError("Introdu numele categoriei.");
      return;
    }
    try {
      await onSave({
        name: name.trim(),
        departmentId: departmentId === "" ? null : Number(departmentId),
      });
      setName("");
      setDepartmentId("");
      onClose();
    } catch {
      // error handled upstream
    }
  };

  return (
    <div className="creaza-categorie-overlay" onClick={onClose}>
      <div
        className="creaza-categorie-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="creaza-categorie-header">
          <h2>Adaugă categorie</h2>
          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className="categorie-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categorie-nume">Nume</label>
            <input
              type="text"
              id="categorie-nume"
              placeholder="ex: Probleme stradale"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categorie-departament">Departament</label>
            <select
              id="categorie-departament"
              value={departmentId}
              onChange={(event) =>
                setDepartmentId(
                  event.target.value ? Number(event.target.value) : ""
                )
              }
            >
              <option value="">Alege un departament...</option>
            {departmentOptions.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {(localError || error) && (
            <p className="categorie-error">{localError ?? error}</p>
          )}

          <button type="submit" className="button-salvare" disabled={isSubmitting}>
            {isSubmitting ? "Se salvează..." : "Salvează"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryCard;