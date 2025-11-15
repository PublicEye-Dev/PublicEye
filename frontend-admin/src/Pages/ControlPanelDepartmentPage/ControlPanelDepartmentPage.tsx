import React, { useState } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import CardControlPanel from "../../Components/CardControlPanel/CardControlPanel";
import { FaShieldAlt, FaMoneyBillWave, FaCity } from "react-icons/fa";
import "./ControlPanelDepartmentPage.css";
import AddDepartmentModal from "../../Components/AddDepartmentModal/AddDepartmentModal";

const ControlPanelDepartamentPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="control-panel-container">
        <div>
         <h4>Gestionare departamente</h4>
        </div>
        <div className="add-department-container">
          <div className="title">
           
          </div>
          <div>
            <button className="add-operator-button">Adaugă Operator</button>
            <button className="add-department-button"
            onClick={() => setIsModalOpen(true)}
          >Adaugă departament</button>
        </div>
        </div>

        <div className="control-panel-grid">
          <CardControlPanel
            icon={<FaShieldAlt />}
            title="Poliție"
            description="Vezi rapoartele de poliție"
            to="/politie"
          />

          <CardControlPanel
            icon={<FaMoneyBillWave />}
            title="Taxe"
            description="Vezi rapoartele de taxe"
            to="/taxe"
          />

          <CardControlPanel
            icon={<FaCity />}
            title="Urbanism"
            description="Vezi rapoartele de urbanism"
            to="/urbanism"
          />

          <CardControlPanel
            icon={<FaShieldAlt />}
            title="Poliție"
            description="Vezi rapoartele de poliție"
            to="/politie"
          />

          <CardControlPanel
            icon={<FaMoneyBillWave />}
            title="Taxe"
            description="Vezi rapoartele de taxe"
            to="/taxe"
          />

          <CardControlPanel
            icon={<FaCity />}
            title="Urbanism"
            description="Vezi rapoartele de urbanism"
            to="/urbanism"
          />
        </div>
      </div>
      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ControlPanelDepartamentPage;
