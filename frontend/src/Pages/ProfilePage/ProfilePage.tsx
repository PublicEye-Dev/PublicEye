import React from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom"; 
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate(); 


  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

    
      <div className="page-card"> 
        
       
        <div className="back-button-wrapper"> 
          <button className="back-button" onClick={handleBack}>
            <GoArrowLeft size={20} />
            <span>Înapoi</span>
          </button>
        </div>
       

        <ProfileCard />
      </div>
    </div>
  );
}

export default ProfilePage;