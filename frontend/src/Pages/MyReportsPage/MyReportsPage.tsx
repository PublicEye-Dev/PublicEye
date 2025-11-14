import React from 'react';
import Navbar from '../../Components/Layout/Navbar/Navbar';
import MyReports from '../../Components/MyReports/MyReports';
import { GoArrowLeft } from "react-icons/go";     
import { useNavigate } from "react-router-dom"; 
import './MyReportsPage.css';                      

const MyReportsPage: React.FC = () => {
  const navigate = useNavigate(); 

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className="page-container">
    <div className="my-reports-page-header">
        <Navbar />
      </div>
    <div className="my-reports-page-down"> 
        <div className="back-button-wrapper"> 
          <button className="back-button" onClick={handleBack}>
            <GoArrowLeft size={20} />
            <span>Înapoi</span>
          </button>
        </div>

      <div className="my-reports-page-card">
        
        <MyReports />
      </div>
    </div>
    </div>
  );
}

export default MyReportsPage;