import "./ViewDepartment.css";
import type {
  CategoryOption,
  CategorySummary,
  Department,
} from "../../Types/department";
import type { User } from "../../Types/user";

interface ViewDepartmentProps {
  department: Department | null;
  operator: User | null;
  isLoading: boolean;
  error: string | null;
  formName: string;
  formDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSaveDetails: () => void;
  isSavingDetails: boolean;
  addCategoryOptions: CategoryOption[];
  selectedAddCategoryId: number | "";
  onSelectAddCategory: (value: number | "") => void;
  onAddCategory: () => void;
  removeCategoryOptions: CategorySummary[];
  selectedRemoveCategoryId: number | "";
  onSelectRemoveCategory: (value: number | "") => void;
  onRemoveCategory: () => void;
  isUpdatingCategory: boolean;
  onDeleteClick: () => void;
  isDeleting: boolean;
}

const ViewDepartment: React.FC<ViewDepartmentProps> = ({
  department,
  operator,
  isLoading,
  error,
  formName,
  formDescription,
  onNameChange,
  onDescriptionChange,
  onSaveDetails,
  isSavingDetails,
  addCategoryOptions,
  selectedAddCategoryId,
  onSelectAddCategory,
  onAddCategory,
  removeCategoryOptions,
  selectedRemoveCategoryId,
  onSelectRemoveCategory,
  onRemoveCategory,
  isUpdatingCategory,
  onDeleteClick,
  isDeleting,
}) => {
  if (isLoading) {
    return (
      <div className="container">
        <h1>Vizualizare Departament</h1>
        <p>Se încarcă detaliile departamentului...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Vizualizare Departament</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="container">
        <h1>Vizualizare Departament</h1>
        <p className="error-message">Departamentul nu a fost găsit.</p>
      </div>
    );
  }

  const categoriesLabel = department.categories.length
    ? department.categories.map((category) => category.name).join(", ")
    : "Fără categorii asociate";

  return (
    <div className="container">
      <h1>Vizualizare Departament</h1>

      <h2>Detalii Departament</h2>

      <div className="content-wrapper">
        <div className="main-details">
          <form id="department-form">
            <div className="static-field">
              <span className="label">Id:</span>
              <span className="value">{department.id}</span>
            </div>

            <div className="form-group">
              <label htmlFor="dept-nume">Nume</label>
              <input
                type="text"
                id="dept-nume"
                value={formName}
                onChange={(event) => onNameChange(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dept-descriere">Descriere</label>
              <input
                type="text"
                id="dept-descriere"
                value={formDescription}
                onChange={(event) => onDescriptionChange(event.target.value)}
              />
            </div>

            <div className="static-field">
              <span className="label">Categorii:</span>
              <span className="value">{categoriesLabel}</span>
            </div>

            <div className="form-group" style={{ marginTop: "30px" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={onSaveDetails}
                disabled={isSavingDetails}
              >
                {isSavingDetails ? "Se salvează..." : "Salvează Detalii"}
              </button>
            </div>
          </form>
        </div>

        <div className="sidebar-actions">
          <div className="form-group">
            <label htmlFor="categorie-1">Adaugă Categorie</label>
            <select
              id="categorie-1"
              form="department-form"
              value={selectedAddCategoryId}
              onChange={(event) =>
                onSelectAddCategory(
                  event.target.value ? Number(event.target.value) : ""
                )
              }
            >
              <option value="">Selectează o categorie</option>
              {addCategoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-primary"
              onClick={onAddCategory}
              disabled={
                !selectedAddCategoryId || isUpdatingCategory || addCategoryOptions.length === 0
              }
            >
              {isUpdatingCategory ? "Se aplică..." : "Adaugă"}
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="categorie-2">Renunță la Categorie</label>
            <select
              id="categorie-2"
              form="department-form"
              value={selectedRemoveCategoryId}
              onChange={(event) =>
                onSelectRemoveCategory(
                  event.target.value ? Number(event.target.value) : ""
                )
              }
            >
              <option value="">Selectează o categorie</option>
              {removeCategoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-secondary"
              onClick={onRemoveCategory}
              disabled={!selectedRemoveCategoryId || isUpdatingCategory}
            >
              {isUpdatingCategory ? "Se aplică..." : "Renunță"}
            </button>
          </div>
        </div>
      </div>

      <h2>Operator Details</h2>
      <div className="operator-details">
        {operator ? (
          <>
            <div className="static-field">
              <span className="label">Nume:</span>
              <span className="value">{operator.fullName}</span>
            </div>

            <div className="static-field">
              <span className="label">Email:</span>
              <span className="value">{operator.email ?? "-"}</span>
            </div>

            <div className="static-field">
              <span className="label">Nr. tel:</span>
              <span className="value">{operator.phoneNumber ?? "-"}</span>
            </div>
          </>
        ) : (
          <p className="value">
            Departamentul nu are încă un operator atribuit. Folosește butonul
            “Adaugă operator” din pagina principală.
          </p>
        )}
      </div>

      <div className="bottom-actions">
        <button
          type="button"
          className="btn-danger"
          onClick={onDeleteClick}
          disabled={isDeleting}
        >
          Șterge Departament
        </button>
        <button type="button" className="btn-secondary" disabled={!operator}>
          Trimite mail operator
        </button>
      </div>
    </div>
  );
};

export default ViewDepartment;