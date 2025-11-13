import React from 'react';
import { GoArrowLeft } from "react-icons/go";
import './CreateReport.css';


const CreareReport: React.FC = () => {
 const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Formular trimis!");
   
  };
  const handleCancel = () => {
    console.log("Anulat");
 
  };
    
    return (
    <div className="report-container">
    
    <form className=" form-group report-form" onSubmit={handleSubmit}>

    {/* Secțiunea de încărcare fișiere */}
        <div className="form-group">
          <div  className="file-upload-section">
          <div className="file-upload-label-container">
          <label>Poze sau filmări</label>
          </div>

          <div className="file-upload-box">
              <input 
              type="file" 
              id="file-upload" 
              accept="image/*,video/*" 
              style={{ display: 'none' }} 
            />
            

            <label htmlFor="file-upload" className="file-upload-label">
              <span className="upload-icon">📷</span>
              <p>Adaugă fișier de max. 25 MB</p>
            </label>
          </div>
          </div>
        </div>


        {/* Secțiunea Descriere */}
        <div className="form-group ">
        <div className="description-section">

          <div className="description-label-container">
          <label htmlFor="description">Descriere *</label>
          </div>

         
          <textarea 
            id="description" 
            rows={5} 
            required 
          />
        
        </div>
        </div>


        {/* Secțiunea Categorie */}
        <div className="form-group">

          <div className="category-label-container">

            <div className="category-section">
          <label htmlFor="category">Categorie *</label>
          </div>

          <select id="category" required>
            {/* Opțiune placeholder */}
            <option value="" disabled selected>Alege o categorie</option>
            {}
          </select>
          

          </div>
        </div>


        {/* Secțiunea Subcategorie */}
        <div className="form-group">
          <div className="subcategory-label-container">
          <div className="subcategory-section">
          <label htmlFor="subcategory">Subcategorie *</label>
          </div>

          <select id="subcategory" required>
            {/* Opțiune placeholder */}
            <option value="" disabled selected>Alege o subcategorie</option>
            {}
          </select>
        </div>
        </div>

        {/* Butoanele de acțiune */}
        <div className="form-actions">
          <button type="submit" className="button-primary">Trimite</button>
          <button type="button" className="button-secondary" onClick={handleCancel}>
            Renunță
          </button>
        </div>
        </form>
    
    </div>
    );
    
}

export default CreareReport;