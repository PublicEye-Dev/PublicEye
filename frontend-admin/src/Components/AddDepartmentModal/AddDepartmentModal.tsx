import React from 'react';
import { FaTimes } from 'react-icons/fa'; 
import './AddDepartmentModal.css';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose }) => {
  
    if (!isOpen) {
    return null;
  }

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    
    <div className="modal-overlay" onClick={onClose} >
      
    
      <div className="modal-content" onClick={handleContentClick}>
        
        <div className="modal-header">
          <h3>Adaugă un departament nou</h3>
          <button className="modal-close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form className="department-form">
            
            <div className="form-group">
              <label htmlFor="name">Nume departament</label>
              <input 
                type="text" 
                id="name" 
                placeholder="ex: Serviciul Urbanism" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Descriere</label>
              <textarea 
                id="description" 
                rows={4} 
                placeholder="ex: Gestionează rapoartele de urbanism..."
              ></textarea>
            </div>

          </form>
        </div>

        <div className="modal-footer">
          <button className="button-cancel" onClick={onClose}>Anulează</button>
          <button className="button-save">Salvează</button>
        </div>

      </div>
    </div>
  );
};

export default AddDepartmentModal;