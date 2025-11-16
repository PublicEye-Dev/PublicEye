import "./SubcategoriesList.css";
import type { Subcategory } from "../../Types/subcategory";

interface SubcategoriesListTableProps {
  subcategories?: Subcategory[];
  isLoading: boolean;
  error: string | null;
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (subcategory: Subcategory) => void;
  isSubmitting: boolean;
}

export default function SubcategoriesListTable({
  subcategories,
  isLoading,
  error,
  onEdit,
  onDelete,
  isSubmitting,
}: SubcategoriesListTableProps) {
  const rows = subcategories ?? [];

  if (isLoading) {
    return (
      <div className="categories-table-empty">
        Se încarcă lista de subcategorii...
      </div>
    );
  }

  if (error) {
    return <div className="categories-error">{error}</div>;
  }

  if (!rows.length) {
    return (
      <div className="categories-table-empty">
        Nu există subcategorii care să corespundă filtrării curente.
      </div>
    );
  }

  return (
    <div className="categories-table-wrapper">
      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>Categorie</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((subcategory) => (
            <tr key={subcategory.id}>
              <td>{subcategory.id}</td>
              <td>{subcategory.name}</td>
              <td>{subcategory.categoryName}</td>
              <td>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="categories-table-action"
                    onClick={() => onEdit(subcategory)}
                    disabled={isSubmitting}
                  >
                    Editează
                  </button>
                  <button
                    className="categories-table-action"
                    onClick={() => onDelete(subcategory)}
                    disabled={isSubmitting}
                    style={{ color: "#dc2626" }}
                  >
                    Șterge
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

