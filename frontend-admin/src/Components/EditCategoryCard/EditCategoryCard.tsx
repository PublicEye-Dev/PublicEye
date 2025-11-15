import React, { useState } from 'react';
import './EditCategoryCard.css';

const EditCategoryCard: React.FC = () => {
const [currentStatus, setCurrentStatus] = useState('Nouă');
const [showDeleteModal, setShowDeleteModal] = useState(false);

  const confirmDelete = () => {
    console.log('Sesizare ștearsă!');
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteReport = () => {
    setShowDeleteModal(true);
  };

  const handleSaveStatus = () => {
    console.log('Se salvează statusul:', currentStatus);
  };

    return (
        <div className="categorie-card">
  
  <h2>Categorie</h2>
  
  <div className="categorie-card-body">
    
    <form className="form-stanga">
      
      <div className="form-group">
        <label htmlFor="categorie-id">ID:</label>
        <input 
          type="text" 
          id="categorie-id" 
          value="1" 
          readOnly 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="categorie-nume">Nume:</label>
        <input 
          type="text" 
          id="categorie-nume" 
          placeholder="ex: Probleme stradale" 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="categorie-departament">Departament:</label>
        <select id="categorie-departament">
          <option value="">Alege un departament...</option>
          <option value="politie">Poliție</option>
          <option value="taxe">Taxe</option>
          <option value="urbanism">Urbanism</option>
        </select>
      </div>
      
      <button type="submit" className="button-salvare" onClick={handleSaveStatus}>Salvare</button>
      
    </form>
    
    <div className="form-dreapta">
      
      <div className="form-group">
        <label htmlFor="subcategorie-add">Adaugă subcategorie:</label>
        <select id="subcategorie-add">
          <option value="">Alege subcategoria...</option>
          <option value="subcat1">Subcategorie Nouă 1</option>
          <option value="subcat2">Subcategorie Nouă 2</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="subcategorie-extract">Extrage subcategorie:</label>
        <select id="subcategorie-extract">
          <option value="">Alege subcategoria...</option>
          <option value="subcatA">Subcategorie Existentă A</option>
          <option value="subcatB">Subcategorie Existentă B</option>
        </select>
      </div>
      
      <button type="button" className="button-sterge" onClick={handleDeleteReport}>
        Șterge subcategorie
      </button>
      
    </div>
    
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
    )
        
};

export default EditCategoryCard;