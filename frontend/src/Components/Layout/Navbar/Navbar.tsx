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
  const { token, logout } = useAuthStore();

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
    navigate("/");
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
          <span className="login-button login-button--label">Cetățean</span>
        ) : (
          <Link to="/login" className="login-button">
            Intra în cont
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
                  onClick={() => handleProtectedNav("/profil")}
                >
                  Contul meu
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/sesizarile-mele")}
                >
                  Sesizările mele
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/adauga-sesizare")}
                >
                  Depune sesizare
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/petitie")}
                >
                  Depune Petiție
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/petitiile-mele")}
                >
                  Petițiile Mele
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => handleProtectedNav("/petitii")}
                >
                  Petiții
                </button>

                <button
                  onClick={handleLogout}
                  className="dropdown-item dropdown-item--button"
                >
                  Deconectare
                </button>
              </>
            ) : (
              <>
                <button className="dropdown-item" onClick={() => goLogin()}>
                  Intra în cont
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => goLogin("/adauga-sesizare")}
                >
                  Depune sesizare
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => goLogin("/petitie")}
                >
                  Depune Petiție
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => goLogin("/petitiile-mele")}
                >
                  Petițiile Mele
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => goLogin("/petitii")}
                >
                  Petiții
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
