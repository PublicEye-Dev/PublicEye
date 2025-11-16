import React, { useEffect, useState } from 'react';
import './MyPetitions.css';
import type { Petition } from '../../Types/petition';
import { getUserInfo } from '../../Services/accountService';
import { getUserPetitions } from '../../Services/petitionService';
import { FaRegClock, FaCheckCircle } from "react-icons/fa";

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function MyPetitions() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await getUserInfo();
        const list = await getUserPetitions(user.id);
        const sorted = [...list].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        setPetitions(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nu s-au putut încărca petițiile.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  if (isLoading) {
    return (
      <div className="my-petitions-container">
        <h2 className="my-petitions-title">Petițiile mele</h2>
        <hr className="title-divider" />
        <div className="loading-area">
          <div className="loading-spinner" />
          <p>Se încarcă petițiile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-petitions-container">
        <h2 className="my-petitions-title">Petițiile mele</h2>
        <hr className="title-divider" />
        <div className="error-box">{error}</div>
      </div>
    );
  }

  if (petitions.length === 0) {
    return (
      <div className="my-petitions-container">
        <h2 className="my-petitions-title">Petițiile mele</h2>
        <hr className="title-divider" />
        <div className="empty-state">
          Nu aveți petiții încă.
        </div>
      </div>
    );
  }

  return (
    <div className="my-petitions-container">
      <h2 className="my-petitions-title">Petițiile mele</h2>
      <hr className="title-divider" />

      <div className="petitions-list">
        {petitions.slice(page * size, page * size + size).map((p) => (
          <div key={p.id} className="petition-card">
            <div className="petition-card-header">
              <span className="petition-id">PTN-{String(p.id).padStart(6, '0')}</span>
            </div>
            <h3 className="petition-title">{p.title}</h3>
            <div className="petition-meta">
              <span className="petition-receiver">Către: {p.receiver}</span>
              {p.createdAt && (
                <span className="petition-date">Depusă la {formatDate(p.createdAt)}</span>
              )}
            </div>
            <div className="petition-status">
              <span className="status-icon">
                {p.status === "CLOSED" ? <FaCheckCircle /> : <FaRegClock />}
              </span>
              <span className="status-label">
                {p.status === "CLOSED" ? "Închisă" : p.status === "BANNED" ? "Blocat" : "Activă"}
              </span>
              <span className="votes">Voturi: {p.votes}</span>
            </div>
          </div>
        ))}
      </div>

      {petitions.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <button
            className="back-button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page <= 0}
          >
            Anterior
          </button>
          <span style={{ color: '#666' }}>
            Pagina {page + 1} din {Math.max(1, Math.ceil(petitions.length / size))} (total {petitions.length})
          </span>
          <button
            className="back-button"
            onClick={() => {
              const totalPages = Math.ceil(petitions.length / size);
              setPage((p) => Math.min(totalPages - 1, p + 1));
            }}
            disabled={page >= Math.ceil(petitions.length / size) - 1}
          >
            Următor
          </button>
        </div>
      )}
    </div>
  );
}


