import React from "react";
import "./ViewDepartment.css";

const ViewDepartment: React.FC = () => {
    return (  <div className="container">
            <h1>Vizualizare Departament</h1>

            <h2>Detalii Departament</h2>

            <div className="content-wrapper">

                <div className="main-details">
                    <form id="department-form">
                        
                        <div className="static-field">
                            <span className="label">Id:</span>
                            <span className="value">1</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dept-nume">Nume</label>
                            <input type="text" id="dept-nume" defaultValue="[Numele Departamentului]" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dept-descriere">Descriere</label>
                            <input type="text" id="dept-descriere" defaultValue="acesta descrierea" />
                        </div>

                        <div className="static-field">
                            <span className="label">Categorii:</span>
                            <span className="value">nume1, nume2, nume3</span>
                        </div>

                        <div className="form-group" style={{ marginTop: '30px' }}>
                             <button type="submit" className="btn-primary">Salvează Detalii</button>
                        </div>

                    </form>
                </div>

                <div className="sidebar-actions">
                    <div className="form-group">
                        <label htmlFor="categorie-1">Adaugă Categorie</label>
                        <select id="categorie-1" form="department-form">
                            <option value="">Selectați o categorie</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                         <label htmlFor="categorie-2">Renunță la Categorie</label>
                        <select id="categorie-2" form="department-form">
                            <option value="">Selectați o categorie</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" form="department-form">Salvează Date</button>
                </div>
            </div>

            <h2>Operator Details</h2>
            <div className="operator-details">
                <div className="static-field">
                    <span className="label">Nume:</span>
                    <span className="value">Ion Ion</span>
                </div>
                
                <div className="static-field">
                    <span className="label">Email:</span>
                    <span className="value">ion@gmail.com</span>
                </div>
                
                <div className="static-field">
                    <span className="label">Nr. tel:</span>
                    <span className="value">0123456789</span>
                </div>
            </div>

            <div className="bottom-actions">
                <button type="button" className="btn-danger">Șterge Departament</button>
                <button type="button" className="btn-secondary">Trimite mail operator</button>
            </div>

        </div>
    )
}

export default ViewDepartment;