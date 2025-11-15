import React from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import CardControlPanel from "../../Components/CardControlPanel/CardControlPanel";
import { 
    FaShieldAlt,    
    FaMoneyBillWave, 
    FaCity,          
} from "react-icons/fa";
import "./ControlPanelDepartmentPage.css";

const ControlPanelDepartamentPage: React.FC = () => {

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="control-panel-container">
        
        <div className="control-panel-grid"> 

          <CardControlPanel
              icon={<FaShieldAlt />}
              title='Poliție'
              description='Vezi rapoartele de poliție'
              to='/politie'
            />

            <CardControlPanel
              icon={<FaMoneyBillWave />}
              title='Taxe'
              description='Vezi rapoartele de taxe'
              to='/taxe'
            />

            <CardControlPanel
              icon={<FaCity />}
              title='Urbanism'
              description='Vezi rapoartele de urbanism'
              to='/urbanism'
            />
            <CardControlPanel
              icon={<FaShieldAlt />}
              title='Poliție'
              description='Vezi rapoartele de poliție'
              to='/politie'
            />

            <CardControlPanel
              icon={<FaMoneyBillWave />}
              title='Taxe'
              description='Vezi rapoartele de taxe'
              to='/taxe'
            />

            <CardControlPanel
              icon={<FaCity />}
              title='Urbanism'
              description='Vezi rapoartele de urbanism'
              to='/urbanism'
            />
        </div>
      </div>
    </div>
  );
};

export default ControlPanelDepartamentPage;