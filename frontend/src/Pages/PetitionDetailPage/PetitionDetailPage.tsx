import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import { getPetitionById } from "../../Services/petitionService";
import type { Petition } from "../../Types/petition";
import "./PetitionDetailPage.css";

export default function PetitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPetitionById(Number(id));
        setPetition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nu s-au putut încărca detaliile petiției.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  return (
    <div className="petition-detail-page">
      <header className="petition-detail-header">
        <Navbar />
      </header>
      <main className="petition-detail-content">
        <button className="back-button" onClick={() => navigate(-1)}>Înapoi</button>

        {isLoading && (
          <div className="loading-area">
            <div className="loading-spinner" />
            <p>Se încarcă detaliile petiției...</p>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {petition && !isLoading && !error && (
          <div className="petition-detail-card">
            <div className="petition-detail-header-row">
              <h1 className="petition-title">{petition.title}</h1>
              <span className="petition-id">PTN-{String(petition.id).padStart(6, "0")}</span>
            </div>

            <div className="petition-meta">
              <div><strong>Destinatar:</strong> {petition.receiver}</div>
              <div><strong>Voturi:</strong> {petition.votes}</div>
              {petition.createdAt && (
                <div><strong>Depusă la:</strong> {new Date(petition.createdAt).toLocaleString()}</div>
              )}
            </div>

            {petition.imageUrl && (
              <div className="petition-image-box">
                <img src={petition.imageUrl} alt="Imagine petiție" />
              </div>
            )}

            <section className="petition-section">
              <h2>Problema</h2>
              <p className="petition-text">{petition.problem}</p>
            </section>

            <section className="petition-section">
              <h2>Soluția propusă</h2>
              <p className="petition-text">{petition.solution}</p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}


