import React from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import CardControlPanel from "../../Components/CardControlPanel/CardControlPanel";
import { 
    FaCog, 
    FaUsers, 
    FaBuilding, 
    FaChartBar, 
    FaTags, 
    FaTag, 
    FaEnvelope 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ControlPanelPage.css";

const ControlPanelPage: React.FC = () => {

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="control-panel-container">
        
        <div className="control-panel-grid"> 

          <CardControlPanel
            icon={<FaCog />} 
            title="Sesizări"
            description="Vezi sesizările"
            to="/sesizari"
          />

          <CardControlPanel
            icon={<FaUsers />} 
            title="Gestionare useri"
            description="Administrează utilizatorii"
            to="/gestionare-useri"
          />

          <CardControlPanel
            icon={<FaBuilding />} 
            title="Gestionare departamente"
            description="Configurează departamentele"
            to="/gestionare-departamente"
          />

          <CardControlPanel
            icon={<FaChartBar />} 
            title="Creare rapoarte"
            description="Generează statistici"
            to="/creare-rapoarte"
          />

          <CardControlPanel
            icon={<FaTags />} 
            title="Gestionare categorii"
            description="Administrează categoriile"
            to="/gestionare-categorii"
          />

          <CardControlPanel
            icon={<FaTag />} 
            title="Gestionare subcategorii"
            description="Administrează subcategoriile"
            to="/gestionare-subcategorii"
          />

          <CardControlPanel
            icon={<FaEnvelope />} 
            title="Petiții"
            description="Vezi petițiile primite"
            to="/petitii"
          />

        </div>
      </div>
    </div>
  );
};

export default ControlPanelPage;