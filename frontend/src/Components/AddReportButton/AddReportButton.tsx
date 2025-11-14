import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import "./AddReportButton.css";

export default function AddReportButton() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleClick = () => {
    if (!token) {
      // daca nu e logat, trimite-l la login si psstreaza destinatia dorita
      navigate("/login?next=/adauga-sesizare");
      return;
    }

    // daca e logat, mergi direct la pagina de adaugare sesizare
    navigate("/adauga-sesizare");
  };

  return (
    <button className="add-report-button" onClick={handleClick}>
      <span className="add-report-button-icon">+</span>
      <span className="add-report-button-text">Adaugă Sesizare</span>
    </button>
  );
}
