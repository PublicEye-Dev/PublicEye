
import { IoSaveOutline, IoTrashOutline, IoMailOutline } from 'react-icons/io5';
import { useState } from 'react';
import './ManageReportCard.css';


const ManageReportCard = () => {
     const [currentStatus, setCurrentStatus] = useState('Nouă');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
  const reportDetails = {
    id: 'REP-00123',
    categorie: 'Drumuri și trotuare',
    subiect: 'Gaură în asfalt',
    descriere: 'Există o gaură mare în asfalt pe strada Exemplu, nr. 10. Pericol pentru mașini.',
    data: '2023-10-26',
    
  };


  const userDetails = {
    nume: 'Ion Popescu',
    telefon: '07xx xxx xxx',
    email: 'ion.popescu@exemplu.com',
  };

  const statusOptions = ['Depusă','Planificată', 'În lucru', 'Redirecționată','Rezolvată'];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value);
   
  };

  const handleSaveStatus = () => {
    console.log('Se salvează statusul:', currentStatus);
    
  };

  const handleDeleteReport = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Sesizare ștearsă!');
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleMailDepartment = () => {
    console.log('Trimite mail departamentului...');
  };

  return (
    <div className="report-card-container">
      {/* Partea stângă: Detalii sesizare */}
      <div className="report-details-section">
        <h3>Detalii Sesizare</h3>
        <ul>
          <li><strong>ID:</strong> {reportDetails.id}</li>
          <li><strong>Categorie:</strong> {reportDetails.categorie}</li>
          <li><strong>Subiect:</strong> {reportDetails.subiect}</li>
          <li><strong>Data:</strong> {reportDetails.data}</li>
          <li><strong>Status:</strong> {currentStatus}</li> 
          <li><strong>Descriere:</strong> <p>{reportDetails.descriere}</p></li>
        </ul>

        <div className="user-details-section">
          <h3>Date Contact Sesizare</h3>
          <ul>
            <li><strong>Nume:</strong> {userDetails.nume}</li>
            <li><strong>Telefon:</strong> {userDetails.telefon}</li>
            <li><strong>Email:</strong> {userDetails.email}</li>
          </ul>
        </div>
      </div>

      <div className="report-actions-section">
        
        <div className="status-control">
          <label htmlFor="status-select">Status:</label>
          
          
          <div className="status-action-group">
            <select 
              id="status-select" 
              value={currentStatus} 
              onChange={handleStatusChange}
              className="status-dropdown"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            <button className="save-button" onClick={handleSaveStatus}>
              <IoSaveOutline className="button-icon-small" /> Salvează
            </button>
          </div>
        </div>

        <button className="delete-button" onClick={handleDeleteReport}>
          <IoTrashOutline className="button-icon" /> Șterge Sesizare
        </button>

        <button className="mail-button" onClick={handleMailDepartment}>
          <IoMailOutline className="button-icon" /> Mail Departament
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirmă ștergerea</h3>
            <p>Ești sigur că vrei să ștergi această sesizare? Datele șterse nu mai pot fi recuperate.</p>
            <div className="modal-actions">
              <button className="modal-button confirm-delete" onClick={confirmDelete}>Șterge</button>
              <button className="modal-button cancel-delete" onClick={cancelDelete}>Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReportCard;