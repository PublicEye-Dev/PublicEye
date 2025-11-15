import "./CategoriesList.css";
import type { Category } from "../../Types/category";
import { Link } from "react-router-dom";

interface CategoriesListTableProps {
  categories?: Category[];
  isLoading: boolean;
  error: string | null;
}

export default function CategoriesListTable({
  categories,
  isLoading,
  error,
}: CategoriesListTableProps) {
  const rows = categories ?? [];

  if (isLoading) {
    return (
      <div className="categories-table-empty">
        Se încarcă lista de categorii...
      </div>
    );
  }

  if (error) {
    return <div className="categories-error">{error}</div>;
  }

  if (!rows.length) {
    return (
      <div className="categories-table-empty">
        Nu există categorii care să corespundă filtrării curente.
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
            <th>Departament</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.departmentName ?? "Nealocat"}</td>
              <td>
                <Link
                  to={`/editare-categorie?id=${category.id}`}
                  className="categories-table-action"
                >
                  Vezi detalii
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

