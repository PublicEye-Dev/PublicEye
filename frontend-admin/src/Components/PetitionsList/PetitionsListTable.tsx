import "./PetitionsList.css";
import type { Petition } from "../../Types/petition";
import { Link } from "react-router-dom";

interface PetitionsListTableProps {
  petitions: Petition[];
  isLoading: boolean;
  error: string | null;
}

export default function PetitionsListTable({
  petitions,
  isLoading,
  error,
}: PetitionsListTableProps) {
  if (isLoading) {
    return (
      <div className="categories-table-empty">Se încarcă petițiile...</div>
    );
  }

  if (error) {
    return <div className="categories-error">{error}</div>;
  }

  if (!petitions.length) {
    return (
      <div className="categories-table-empty">
        Nu există petiții pentru filtrarea curentă.
      </div>
    );
  }

  return (
    <div className="categories-table-wrapper">
      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titlu</th>
            <th>Destinatar</th>
            <th>Status</th>
            <th>Dată</th>
            <th>Voturi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {petitions.map((petition) => {
            const dateLabel = petition.createdAt
              ? new Date(petition.createdAt).toLocaleDateString("ro-RO")
              : "-";
            const statusKey = petition.status
              ? petition.status.toLowerCase()
              : "unknown";
            return (
              <tr key={petition.id}>
                <td>{petition.id}</td>
                <td>{petition.title}</td>
                <td>{petition.receiver}</td>
                <td>
                  <span className={`status-chip status-${statusKey}`}>
                    {petition.status ?? "N/A"}
                  </span>
                </td>
                <td>{dateLabel}</td>
                <td>{petition.votes}</td>
                <td>
                  <Link
                    to={`/petitii-admin/${petition.id}`}
                    className="categories-table-action"
                  >
                    Vezi detalii
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

