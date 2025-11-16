import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import "./AddReportButton.css";

interface AddReportButtonProps {
  onStartCreate?: () => void;
}

export default function AddReportButton({ onStartCreate }: AddReportButtonProps) {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleClick = () => {
    if (!token) {
      // daca nu e logat, trimite-l la login si pastreaza destinatia dorita
      navigate("/login?next=/adauga-sesizare");
      return;
    }

    // daca e logat si avem callback (pentru modal/selectie locatie), il folosim
    if (onStartCreate) {
      onStartCreate();
      return;
    }

    // fallback: mergi direct la pagina de adaugare sesizare
    navigate("/adauga-sesizare");
  };

  return (
    <button className="add-report-button" onClick={handleClick}>
      <span className="add-report-button-icon">+</span>
      <span className="add-report-button-text">Adaugă Sesizare</span>
    </button>
  );
}
