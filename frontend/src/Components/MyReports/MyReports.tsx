import React from 'react';
import './MyReports.css';
import { 
  FaCog, 
  FaCheckCircle,
  FaRegClock,     
  FaCalendarAlt, 
  FaShareSquare, 

} from "react-icons/fa";

const MyReports: React.FC = () => {
    return(
<div className="my-reports-page-container">
  
  <h2 className="my-reports-title">Sesizările mele</h2>
  <hr className="title-divider" />

  <div className="reports-list-container">

    <div className="report-card">
      <div className="status-bar in-asteptare"></div>
      <div className="report-content">
        <div className="report-header">
          <span className="report-id">SZN2025-019300</span>
        </div>
        <h3 className="report-description">
          Coș de gunoi stradal plin
        </h3>
        <span className="report-date-deposited">Depusă la 15.11.2025</span>
        <div className="report-status">
          <span className="status-icon in-asteptare">
            <FaRegClock />
          </span>
          <span className="report-status-date">15.11.2025</span>
          <span>-</span>
          <span className="report-status-label">În așteptare</span>
        </div>
      </div>
    </div>


    <div className="report-card">
      <div className="status-bar planificata"></div>
      <div className="report-content">
        <div className="report-header">
          <span className="report-id">SZN2025-019288</span>
        </div>
        <h3 className="report-description">
          Solicitare trecere de pietoni suplimentară
        </h3>
        <span className="report-date-deposited">Depusă la 14.11.2025</span>
        <div className="report-status">
          <span className="status-icon planificata">
            <FaCalendarAlt /> 
          </span>
          <span className="report-status-date">15.11.2025</span>
          <span>-</span>
          <span className="report-status-label">Planificată</span>
        </div>
      </div>
    </div>

    <div className="report-card">
      <div className="status-bar in-lucru"></div>
      <div className="report-content">
        <div className="report-header">
          <span className="report-id">SZN2025-019245</span>
        </div>
        <h3 className="report-description">
          Lipsa iluminat
        </h3>
        <span className="report-date-deposited">Depusă la 13.11.2025</span>
        <div className="report-status">
          <span className="status-icon in-lucru">
            <FaCog /> 
          </span>
          <span className="report-status-date">14.11.2025</span>
          <span>-</span>
          <span className="report-status-label">În lucru</span>
        </div>
      </div>
    </div>

    <div className="report-card">
      <div className="status-bar rezolvata"></div>
      <div className="report-content">
        <div className="report-header">
          <span className="report-id">SZN2025-018900</span>
        </div>
        <h3 className="report-description">
          Semnal de pe trecerea de pietoni nu functioneaza
        </h3>
        <span className="report-date-deposited">Depusă la 10.11.2025</span>
        <div className="report-status">
          <span className="status-icon rezolvata">
            <FaCheckCircle /> 
          </span>
          <span className="report-status-date">11.11.2025</span>
          <span>-</span>
          <span className="report-status-label">Rezolvată</span>
        </div>
      </div>
    </div>

    <div className="report-card">
      <div className="status-bar redirectionata"></div>
      <div className="report-content">
        <div className="report-header">
          <span className="report-id">SZN2025-018700</span>
        </div>
        <h3 className="report-description">
          Probleme cu rețeaua de gaz
        </h3>
        <span className="report-date-deposited">Depusă la 09.11.2025</span>
        <div className="report-status">
          <span className="status-icon redirectionata">
            <FaShareSquare />
          </span>
          <span className="report-status-date">09.11.2025</span>
          <span>-</span>
          <span className="report-status-label">Redirecționată</span>
        </div>
      </div>
    </div>

  </div>
</div>
    );
}

export default MyReports;