import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./CreateReportPage.css";

export default function CreateReportPage() {
  return (
    <div className="create-report-page">
      <header className="create-report-header">
        <Navbar />
      </header>

      <main className="create-report-content">
        <div className="create-report-card">
          <p className="create-report-badge">Funcționalitate în lucru</p>
          <h1>Depunere sesizare</h1>
          <p>
            Modulul de depunere sesizări pentru administrație va fi disponibil
            în curând.
          </p>
        </div>
      </main>
    </div>
  );
}

