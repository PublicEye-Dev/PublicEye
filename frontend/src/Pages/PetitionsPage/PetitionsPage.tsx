import React, { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../../Components/Layout/Navbar/Navbar';
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import type { Petition } from '../../Types/petition';
import { getPetitionsPaginated, type PetitionQuery, votePetition } from '../../Services/petitionService';

export default function PetitionsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Petition[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<PetitionQuery>({
    page: 0,
    size: 10,
    sortBy: "createdAt",
    sortDir: "DESC",
    status: "ALL",
  });

  // Modal state pentru vot
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [voteName, setVoteName] = useState("");
  const [voteError, setVoteError] = useState<string | null>(null);
  const [voteSuccess, setVoteSuccess] = useState<string | null>(null);
  const [currentPetitionId, setCurrentPetitionId] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Track petiții deja votate (persistate local)
  const [votedPetitions, setVotedPetitions] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem("voted-petitions");
      const parsed: number[] = raw ? JSON.parse(raw) : [];
      return new Set(parsed);
    } catch {
      return new Set();
    }
  });
  const persistVoted = (setValues: Set<number>) => {
    try {
      localStorage.setItem("voted-petitions", JSON.stringify(Array.from(setValues)));
    } catch {
      // ignore storage errors
    }
  };

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await getPetitionsPaginated(query);
      setItems(resp.content);
      setTotalPages(resp.totalPages);
      setTotalElements(resp.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu s-au putut încărca petițiile.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrev = () => {
    setQuery((prev) => ({ ...prev, page: Math.max(0, (prev.page ?? 0) - 1) }));
  };
  const handleNext = () => {
    setQuery((prev) => ({ ...prev, page: Math.min(totalPages - 1, (prev.page ?? 0) + 1) }));
  };

  const openVoteModal = (petitionId: number) => {
    setCurrentPetitionId(petitionId);
    setVoteName("");
    setVoteError(null);
    setVoteSuccess(null);
    setIsVoteModalOpen(true);
  };

  const closeVoteModal = () => {
    setIsVoteModalOpen(false);
    setCurrentPetitionId(null);
    setVoteName("");
    setVoteError(null);
    setVoteSuccess(null);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      closeVoteModal();
    }
  };

  const handleConfirmVote = async () => {
    if (!currentPetitionId) return;
    if (!voteName.trim()) {
      setVoteError("Numele este obligatoriu.");
      return;
    }
    if (votedPetitions.has(currentPetitionId)) {
      setVoteError("Ai semnat deja această petiție");
      setTimeout(() => {
        closeVoteModal();
      }, 1000);
      return;
    }
    setVoteError(null);
    try {
      await votePetition(currentPetitionId, { signerName: voteName.trim() });
      setVoteSuccess("Votul a fost înregistrat!");
      // marchează ca votată local
      setVotedPetitions((prev) => {
        const next = new Set(prev);
        next.add(currentPetitionId);
        persistVoted(next);
        return next;
      });
      // Reîncarcă lista și închide modalul după un scurt delay
      setTimeout(() => {
        closeVoteModal();
        void load();
      }, 800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Eroare la înregistrarea votului.";
      setVoteError(msg);
      // Dacă mesajul indică vot deja existent, marchează local
      if (msg.toLowerCase().includes("ai semnat deja")) {
        setVotedPetitions((prev) => {
          const next = new Set(prev);
          next.add(currentPetitionId);
          persistVoted(next);
          return next;
        });
      }
      // Închide automat modalul după ce informăm utilizatorul
      setTimeout(() => {
        closeVoteModal();
      }, 1200);
    }
  };

  return (
    <div className="page-container">
      <div className="my-petitions-page-header">
        <Navbar />
      </div>
      <div className="my-petitions-page-down">
        <div className="back-button-wrapper">
          <button className="back-button" onClick={handleBack}>
            <GoArrowLeft size={20} />
            <span>Înapoi</span>
          </button>
        </div>

        <div className="my-petitions-page-card">
          <h2 style={{ marginTop: 0 }}>Petiții</h2>
          <hr className="title-divider" />

          {isLoading && (
            <div className="loading-area">
              <div className="loading-spinner" />
              <p>Se încarcă petițiile...</p>
            </div>
          )}

          {error && (
            <div className="error-box" style={{ marginBottom: 12 }}>{error}</div>
          )}

          {!isLoading && !error && (
            <>
              <div className="petitions-list">
                {items.map((p) => (
                  <div key={p.id} className="petition-card">
                    <div className="petition-card-header">
                      <span className="petition-id">PTN-{String(p.id).padStart(6, '0')}</span>
                      <span style={{ color: '#666' }}>{new Date(p.createdAt ?? '').toLocaleDateString()}</span>
                    </div>
                    <h3 className="petition-title">{p.title}</h3>
                    <div className="petition-meta">
                      <span className="petition-receiver">Către: {p.receiver}</span>
                      <span className="votes">Voturi: {p.votes}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        className="submit-button"
                        onClick={() => openVoteModal(p.id)}
                        disabled={votedPetitions.has(p.id)}
                      >
                        {votedPetitions.has(p.id) ? "Votat" : "Votează"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <button className="back-button" onClick={handlePrev} disabled={(query.page ?? 0) <= 0}>
                  Anterior
                </button>
                <span style={{ color: '#666' }}>
                  Pagina {(query.page ?? 0) + 1} din {Math.max(1, totalPages)} (total {totalElements})
                </span>
                <button className="back-button" onClick={handleNext} disabled={(query.page ?? 0) >= totalPages - 1}>
                  Următor
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isVoteModalOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            style={{
              background: '#fff',
              borderRadius: 10,
              width: 'min(420px, 92vw)',
              padding: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 8px' }}>Susține petiția</h3>
            <p style={{ margin: '0 0 12px', color: '#666' }}>
              Introduceți numele dumneavoastră pentru a semna această petiție.
            </p>
            <input
              type="text"
              placeholder="Nume complet"
              value={voteName}
              onChange={(e) => setVoteName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #ddd',
                borderRadius: 8,
                marginBottom: 10,
              }}
            />

            {voteError && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '8px 10px', borderRadius: 8, marginBottom: 10 }}>
                {voteError}
              </div>
            )}
            {voteSuccess && (
              <div style={{ background: '#d4edda', color: '#155724', padding: '8px 10px', borderRadius: 8, marginBottom: 10 }}>
                {voteSuccess}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="back-button" onClick={closeVoteModal}>
                Anulează
              </button>
              <button
                className="submit-button"
                onClick={handleConfirmVote}
                disabled={
                  !voteName.trim() || (currentPetitionId !== null && votedPetitions.has(currentPetitionId))
                }
                title={
                  currentPetitionId !== null && votedPetitions.has(currentPetitionId)
                    ? "Ai semnat deja această petiție"
                    : undefined
                }
              >
                Confirmă
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

