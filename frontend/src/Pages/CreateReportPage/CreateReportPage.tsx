import React from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import Report from "../../Components/CreateReport/CreateReport";
import { GoArrowLeft } from "react-icons/go"; // <-- 1. Importă iconița
import { useNavigate } from "react-router-dom"; // <-- 2. Importă hook-ul de navigare
import './CreateReportPage.css'; // <-- 3. Importă fișierul CSS

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate(); // <-- 4. Inițializează funcția de navigare

  const handleBack = () => {
    navigate(-1); // Funcție simplă care te duce la pagina anterioară
  };

  return (
    <div className="create-report-page-layout">
      <div className="create-report-page-navbar">
        <Navbar />
      </div>

      <div className="report-content-wrapper">
        
       <div className="back-button-wrapper"> 
        <button className="back-button" onClick={handleBack}>
          <GoArrowLeft size={20} />
          <span>Înapoi</span>
        </button>
        </div>

        <div className="report-form-container">
        <Report />
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;