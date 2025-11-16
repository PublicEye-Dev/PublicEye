import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import stemaLogo from "../../../images/logo.png";
import { FaBars } from "react-icons/fa";
import "./Navbar.css";
import { useAuthStore } from "../../../Store/authStore";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { token, role, logout } = useAuthStore();

  const handleDropdownToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const goLogin = (next?: string) => {
    closeMenu();
    if (next) {
      navigate(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    navigate("/login");
  };

  const handleProtectedNav = (path: string) => {
    if (!token) {
      goLogin(path);
      return;
    }
    navigate(path);
    closeMenu();
  };

  const handleLogout = () => {
    if (!token) {
      closeMenu();
      return;
    }
    logout();
    closeMenu();
    navigate("/login");
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="site-header">
      <div className="header-left">
        <Link to="/">
          <img src={stemaLogo} alt="Logo" className="header-logo" />
        </Link>
      </div>

      <div className="header-right" ref={menuRef}>
        {token ? (
          <span className="login-button login-button--label">
            {role === "ADMIN" ? "Administrator" : "Operator"}
          </span>
        ) : (
          <Link to="/login" className="login-button">
            Intră în cont
          </Link>
        )}

        <button
          className="menu-button"
          onClick={handleDropdownToggle}
          aria-label="Meniu"
        >
          <FaBars />
        </button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            {token ? (
              <>
                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/")}
                >
                  Harta sesizărilor
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/card-control-panel")}
                >
                  Tablou de bord
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/contul-meu")}
                >
                  Contul meu
                </button>

                <button
                  onClick={handleLogout}
                  className="dropdown-item dropdown-item--button"
                >
                  Deconectare
                </button>
              </>
            ) : (
              <button className="dropdown-item" onClick={() => goLogin()}>
                Intră în cont
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
