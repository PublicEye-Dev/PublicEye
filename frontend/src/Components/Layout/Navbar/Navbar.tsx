import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import stemaLogo from '../../../images/logo.png'
import { FaBars } from 'react-icons/fa';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDropdownToggle = () => {
    console.log("Meniu apăsat!");
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log("Deconectare...");
    // Logica ta de logout
  };

  return (
    <div className="site-header">
      
      {/* Partea din stânga (Logo) */}
      <div className="header-left">
        <Link to="/dashboard">
          <img src={stemaLogo} alt="Logo" className="header-logo" />
        </Link>
      </div>

      {/* Partea din dreapta (Butoane) */}
      <div className="header-right">

        {/* === 1. BUTONUL NOU ADĂUGAT === */}
        <Link to="/login" className="login-button">
          Admin
        </Link>
        {/* ============================== */}

        {/* 2. Butonul de meniu (dropdown) */}
        <button className="menu-button" onClick={handleDropdownToggle}>
          <FaBars />
        </button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            
            <Link 
              to="/profil" 
              className="dropdown-item" 
              onClick={() => setIsMenuOpen(false)}
            >
              Profilul meu
            </Link>

            <Link 
              to="/sesizari" 
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Sesizările mele
            </Link>
            
            <Link 
              to="/petitiile mele" 
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Petițiile mele
            </Link>

            <Link 
              to="/petitii" 
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Petiții
            </Link>

            <button 
              onClick={handleLogout} 
              className="dropdown-item dropdown-item--button"
            >
              Deconectare
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;