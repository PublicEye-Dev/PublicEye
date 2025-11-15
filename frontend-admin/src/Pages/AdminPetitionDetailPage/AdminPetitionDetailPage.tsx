import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./AdminPetitionDetailPage.css";
import {
  deletePetition,
  getPetitionById,
  updatePetitionStatus,
} from "../../Services/petitionService";
import type { Petition, PetitionStatus } from "../../Types/petition";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";

const statusOptions: PetitionStatus[] = ["ACTIVE", "CLOSED", "BANNED"];

export default function AdminPetitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const petitionId = Number(id);

  const [petition, setPetition] = useState<Petition | null>(null);
  const [status, setStatus] = useState<PetitionStatus>("ACTIVE");
  const [officialResponse, setOfficialResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!petitionId) {
      setError("ID-ul petiției este invalid.");
      setIsLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPetitionById(petitionId);
        setPetition(response);
        setStatus((response.status as PetitionStatus) ?? "ACTIVE");
        setOfficialResponse(response.officialResponse ?? "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Nu s-au putut încărca detaliile petiției."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDetails();
  }, [petitionId]);

  const handleSave = async () => {
    if (!petitionId) return;
    if (!officialResponse.trim()) {
      setError("Motivul oficial este obligatoriu.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updatePetitionStatus(petitionId, {
        status,
        officialResponse: officialResponse.trim(),
      });
      setPetition(updated);
      setSuccess("Statusul a fost actualizat cu succes.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nu s-a putut actualiza statusul petiției."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!petitionId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deletePetition(petitionId);
      navigate("/petitii-admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nu s-a putut șterge petiția selectată."
      );
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="petition-detail-page">
        <Navbar />
        <div className="petition-card">Se încarcă petiția...</div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="petition-detail-page">
        <Navbar />
        <div className="petition-card">
          {error ?? "Petiția nu a fost găsită."}
        </div>
      </div>
    );
  }

  return (
    <div className="petition-detail-page">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="petition-card">
        <h1>{petition.title}</h1>
        <p className="petition-meta">
          <span>Destinatar: {petition.receiver}</span>
          <span>Status curent: {petition.status ?? "N/A"}</span>
          <span>Voturi: {petition.votes}</span>
        </p>

        {error && <p className="categories-error">{error}</p>}
        {success && <p className="categories-success">{success}</p>}

        <div className="petition-body">
          <div>
            <h3>Problema</h3>
            <p>{petition.problem}</p>
          </div>
          <div>
            <h3>Soluție propusă</h3>
            <p>{petition.solution}</p>
          </div>
          {petition.imageUrl && (
            <div className="petition-image">
              <img src={petition.imageUrl} alt={petition.title} />
            </div>
          )}
        </div>

        <div className="petition-actions">
          <div className="petition-form-group">
            <label>Status petiție</label>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as PetitionStatus)
              }
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="petition-form-group">
            <label>Răspuns oficial</label>
            <textarea
              rows={4}
              value={officialResponse}
              onChange={(event) => setOfficialResponse(event.target.value)}
              placeholder="Introduceți motivul schimbării statusului..."
            />
          </div>

          <div className="petition-buttons">
            <button
              type="button"
              className="button-salvare"
              onClick={() => void handleSave()}
              disabled={isSaving}
            >
              {isSaving ? "Se salvează..." : "Salvează"}
            </button>
            <button
              type="button"
              className="button-sterge"
              onClick={() => setShowModal(true)}
              disabled={isDeleting}
            >
              Șterge petiția
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        message="Sunteți sigur că doriți să ștergeți această petiție?"
        confirmLabel="Confirmă"
        cancelLabel="Anulează"
        onCancel={() => setShowModal(false)}
        onConfirm={() => void handleDelete()}
        isProcessing={isDeleting}
      />
    </div>
  );
}

