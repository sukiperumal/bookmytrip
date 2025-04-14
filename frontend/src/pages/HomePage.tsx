"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCar,
  FaPhone,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/homepage.css";

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
  };

  return (
    <div className={`home-page ${theme}`}>
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        }}
      >
        <div className="hero-content">
          <h1>Explore the World Your Way</h1>
          <p>
            Rent the perfect vehicle for your adventure and get 24/7 support
          </p>

          <div className="search-container">
            <form onSubmit={handleSearch}>
              <div className="search-group">
                <div className="search-input">
                  <FaMapMarkerAlt />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                <div className="search-input">
                  <FaCalendarAlt />
                  <input
                    type="date"
                    placeholder="Pick-up Date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <div className="search-input">
                  <FaCalendarAlt />
                  <input
                    type="date"
                    placeholder="Return Date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="search-btn">
                  <FaSearch /> Find Vehicles
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <FaCar />
          </div>
          <h3>Vehicle Rental</h3>
          <p>Choose from our wide range of vehicles for your perfect trip</p>
          <Link to="/vehicles" className="feature-link">
            Explore Vehicles
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <FaPhone />
          </div>
          <h3>24/7 Support</h3>
          <p>
            Our call center is always ready to assist you during your journey
          </p>
          <Link to="/support" className="feature-link">
            Contact Support
          </Link>
        </div>
      </div>

      <div className="popular-destinations">
        <h2>Popular Destinations</h2>
        <div className="destinations-grid">
          {["Bali", "Paris", "Tokyo", "New York"].map((city, index) => (
            <div className="destination-card" key={index}>
              <img
                src={`/placeholder.svg?height=300&width=400&text=${city}`}
                alt={city}
              />
              <div className="destination-info">
                <h3>{city}</h3>
                <p>Explore amazing vehicles available in {city}</p>
                <Link
                  to={`/vehicles?location=${city}`}
                  className="destination-link"
                >
                  View Vehicles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-container">
          {[
            {
              name: "John D.",
              text: "BookMyTrip made our family vacation so much easier! The car rental was smooth and their support team was incredibly helpful.",
            },
            {
              name: "Sarah M.",
              text: "I loved the variety of vehicles available. Found the perfect motorcycle for my coastal trip!",
            },
            {
              name: "Michael T.",
              text: "Their 24/7 support saved our trip when we had a flat tire. Someone was there to help within minutes!",
            },
          ].map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                <p>"{testimonial.text}"</p>
                <h4>{testimonial.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready for Your Next Adventure?</h2>
          <p>
            Book your vehicle now and enjoy the journey with our premium support
          </p>
          <div className="cta-buttons">
            <Link to="/vehicles" className="cta-btn primary">
              Rent a Vehicle
            </Link>
            <Link to="/support" className="cta-btn secondary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
