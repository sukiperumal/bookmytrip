"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location.pathname]); // Re-check when route changes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
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
          {isLoggedIn && (
            <Link
              to="/my-bookings"
              className={`nav-item ${isActive("/my-bookings")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaCalendarAlt className="nav-icon" /> My Bookings
            </Link>
          )}
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

          {isLoggedIn ? (
            <div className="user-menu">
              <span className="user-greeting">
                Hello, {user?.name?.split(" ")[0] || "User"}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <FaUser /> Login
            </Link>
          )}

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
