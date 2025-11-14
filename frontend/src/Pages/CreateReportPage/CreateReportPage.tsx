import React from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import Report from "../../Components/CreateReport/CreateReport";
import { GoArrowLeft } from "react-icons/go"; 
import { useNavigate } from "react-router-dom"; 
import './CreateReportPage.css'; 

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate(); 

  const handleBack = () => {
    navigate(-1); 
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