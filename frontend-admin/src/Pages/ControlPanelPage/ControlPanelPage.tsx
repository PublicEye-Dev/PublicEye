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
  FaEnvelope,
} from "react-icons/fa";
import { useAuthStore } from "../../Store/authStore";
import "./ControlPanelPage.css";

const ControlPanelPage: React.FC = () => {
  const { role } = useAuthStore();
  const isAdmin = role === "ADMIN";

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="control-panel-container">
        <div className="control-panel-grid">
          {/* Carduri comune pentru ADMIN și OPERATOR */}
          <CardControlPanel
            icon={<FaCog />}
            title="Sesizări"
            description="Vezi sesizările"
            to="/sesizari"
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

          {/* Carduri doar pentru ADMIN */}
          {isAdmin && (
            <>
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
                icon={<FaEnvelope />}
                title="Petiții"
                description="Vezi petițiile primite"
                to="/petitii-admin"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanelPage;
