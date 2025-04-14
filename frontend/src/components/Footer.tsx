"use client";

import type React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/footer.css";

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-container">
        <div className="footer-section">
          <h3>BookMyTrip</h3>
          <p>
            Your ultimate travel companion for vehicle rentals and personalized
            support.
          </p>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/vehicles">Rent Vehicles</Link>
            </li>
            <li>
              <Link to="/support">Support</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Vehicle Types</h3>
          <ul>
            <li>
              <Link to="/vehicles?type=car">Cars</Link>
            </li>
            <li>
              <Link to="/vehicles?type=motorcycle">Motorcycles</Link>
            </li>
            <li>
              <Link to="/vehicles?type=bicycle">Bicycles</Link>
            </li>
            <li>
              <Link to="/vehicles?type=boat">Boats</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <FaPhone /> +1 (555) 123-4567
            </li>
            <li>
              <FaEnvelope /> support@bookmytrip.com
            </li>
            <li>
              <FaMapMarkerAlt /> 123 Travel Street, Tourism City
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} BookMyTrip. All rights reserved.
        </p>
        <div className="footer-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
