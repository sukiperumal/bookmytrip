"use client";

import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { FaSun, FaMoon, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-text">BookMyTrip</span>
        </Link>

        <div className={`menu-items ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-item ${isActive("/")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/vehicles"
            className={`nav-item ${isActive("/vehicles")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Rent Vehicles
          </Link>
          <Link
            to="/support"
            className={`nav-item ${isActive("/support")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Support
          </Link>
          <Link
            to="/about"
            className={`nav-item ${isActive("/about")}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <Link to="/login" className="login-btn">
            <FaUser /> Login
          </Link>
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
