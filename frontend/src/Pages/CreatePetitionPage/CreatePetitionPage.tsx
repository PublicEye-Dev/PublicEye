import React from 'react';
import Navbar from '../../Components/Layout/Navbar/Navbar';
import CreatePetition from '../../Components/CreatePetition/CreatePetition';
import { GoArrowLeft } from "react-icons/go"; 
import { useNavigate } from "react-router-dom"; 
import './CreatePetitionPage.css'; 

const CreatePetitionPage: React.FC = () => {
  const navigate = useNavigate(); 


  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className="create-petition-page-layout">
      <div className="create-petition-page-navbar">
        <Navbar />
      </div>
      
      <div className="petition-content-wrapper">
        
        
        <div className="back-button-wrapper"> 
          <button className="back-button" onClick={handleBack}>
            <GoArrowLeft size={20} />
            <span>Înapoi</span>
          </button>
        </div>
       
        <CreatePetition />
      </div>
    </div>
  );
};

export default CreatePetitionPage;