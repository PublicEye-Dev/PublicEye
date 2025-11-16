import { useState, useEffect, type FormEvent } from "react";
import "./CreateSubcategoryCard.css";
import { listCategories } from "../../Services/categoryService";

interface CategoryOption {
  id: number;
  name: string;
}

interface CreateSubcategoryCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { name: string; categoryId: number }) => Promise<void>;
  categories?: CategoryOption[];
  isSubmitting: boolean;
  error: string | null;
  initialData?: {
    name: string;
    categoryId: number;
  };
  mode?: "create" | "edit";
}

const CreateSubcategoryCard: React.FC<CreateSubcategoryCardProps> = ({
  isOpen,
  onClose,
  onSave,
  categories: providedCategories,
  isSubmitting,
  error,
  initialData,
  mode = "create",
}) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Load categories if not provided
  useEffect(() => {
    if (providedCategories && providedCategories.length > 0) {
      setCategories(providedCategories);
    } else if (isOpen) {
      const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
          const data = await listCategories();
          setCategories(
            data.map((cat) => ({
              id: cat.id,
              name: cat.name,
            }))
          );
        } catch (err) {
          setLocalError(
            err instanceof Error
              ? err.message
              : "Eroare la încărcarea categoriilor"
          );
        } finally {
          setIsLoadingCategories(false);
        }
      };
      void fetchCategories();
    }
  }, [isOpen, providedCategories]);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategoryId(initialData.categoryId);
    } else {
      setName("");
      setCategoryId("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const categoryOptions = categories ?? providedCategories ?? [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    
    if (!name.trim()) {
      setLocalError("Introdu numele subcategoriei.");
      return;
    }
    
    if (categoryId === "" || categoryId === undefined || categoryId === null) {
      setLocalError("Selectează o categorie.");
      return;
    }
    
    try {
      await onSave({
        name: name.trim(),
        categoryId: Number(categoryId),
      });
      if (mode === "create") {
        setName("");
        setCategoryId("");
      }
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
          <h2>{mode === "edit" ? "Editează subcategorie" : "Adaugă subcategorie"}</h2>
          <button className="close-button" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <form className="categorie-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subcategorie-nume">Nume</label>
            <input
              type="text"
              id="subcategorie-nume"
              placeholder="ex: Probleme stradale"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subcategorie-categorie">Categorie</label>
            <select
              id="subcategorie-categorie"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(
                  event.target.value ? Number(event.target.value) : ""
                )
              }
              disabled={isLoadingCategories || isSubmitting}
            >
              <option value="">
                {isLoadingCategories
                  ? "Se încarcă..."
                  : "Alege o categorie..."}
              </option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {(localError || error) && (
            <p className="categorie-error">{localError ?? error}</p>
          )}

          <button
            type="submit"
            className="button-salvare"
            disabled={isSubmitting || isLoadingCategories}
          >
            {isSubmitting ? "Se salvează..." : "Salvează"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSubcategoryCard;