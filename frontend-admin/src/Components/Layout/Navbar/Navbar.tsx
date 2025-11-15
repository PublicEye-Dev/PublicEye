import React from "react";
import { Link } from "react-router-dom";
import stemaLogo from "../../../images/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaUser } from "react-icons/fa";
import "./Navbar.css";


const Navbar = () => {
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
         <header className="site-header">
      
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
              to="/petitii" 
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Petițiile mele
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
    </header>
    )
}

export default Navbar;