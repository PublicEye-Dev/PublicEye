import React from 'react';
import Navbar from '../../Components/Layout/Navbar/Navbar';
import CreatePetition from '../../Components/CreatePetition/CreatePetition';
import './CreatePetitionPage.css'; 

const CreatePetitionPage: React.FC = () => {
  return (
  
    <div className="create-petition-page-layout">
      <div className="create-petition-page-navbar">
      <Navbar />
      </div>
      
     
      <div className="petition-content-wrapper">
        <CreatePetition />
      </div>
    </div>
  );
};

export default CreatePetitionPage;