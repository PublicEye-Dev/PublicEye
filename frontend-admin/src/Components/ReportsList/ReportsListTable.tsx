import "./ReportsList.css";
import type { Report } from "../../Types/report";

interface ReportsListTableProps {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  onViewDetails: (id: number) => void;
  isSearching: boolean;
}

export default function ReportsListTable({
  reports,
  isLoading,
  error,
  onViewDetails,
  isSearching,
}: ReportsListTableProps) {
  if (isLoading) {
    return (
      <div className="reports-table-wrapper">
        <div className="reports-empty-state">Se încarcă sesizările...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-table-wrapper">
        <div className="reports-empty-state">
          {error}
          {isSearching && (
            <p style={{ marginTop: "0.5rem", fontWeight: 400 }}>
              Încearcă o nouă căutare sau resetează filtrele.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="reports-table-wrapper">
        <div className="reports-empty-state">
          {isSearching
            ? "Nicio sesizare nu se potrivește căutării."
            : "Momentan nu există sesizări pentru filtrele selectate."}
        </div>
      </div>
    );
  }

  return (
    <div className="reports-table-wrapper">
      <table className="reports-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descriere</th>
            <th>Categorie</th>
            <th>Status</th>
            <th>Dată</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const statusKey = report.status.toLowerCase();
            const dateLabel = report.createdAt
              ? new Date(report.createdAt).toLocaleDateString("ro-RO")
              : "-";
            const description =
              report.description.length > 80
                ? `${report.description.slice(0, 80)}…`
                : report.description;

            return (
              <tr key={report.id}>
                <td>#{report.id}</td>
                <td>{description}</td>
                <td>{report.categoryName ?? "Categorie necunoscută"}</td>
                <td>
                  <span className={`status-chip ${statusKey}`}>
                    {report.status.replace("_", " ")}
                  </span>
                </td>
                <td>{dateLabel}</td>
                <td>
                  <button onClick={() => onViewDetails(report.id)}>
                    Vezi detalii
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

