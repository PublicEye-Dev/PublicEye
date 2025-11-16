import React from 'react';
import Navbar from '../../Components/Layout/Navbar/Navbar';
import MyPetitions from '../../Components/MyPetitions/MyPetitions';
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import './MyPetitionsPage.css';

export default function MyPetitionsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
          <MyPetitions />
        </div>
      </div>
    </div>
  );
}

