import React from 'react';
import './CreateCategoryCard.css';

const CreateCategoryCard: React.FC = () => {
    return (
        <div className="creaza-categorie-card">
  
  <h2>Crează categorie</h2>
  
  <form className="categorie-form">
    
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
    
    <button type="submit" className="button-salvare">Salvează</button>
    
  </form>
  
</div>
    );
};

export default CreateCategoryCard;