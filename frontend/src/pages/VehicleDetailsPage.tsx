"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaUsers,
  FaGasPump,
  FaCalendarAlt,
  FaCheck,
  FaArrowLeft,
  FaHeart,
  FaShare,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/vehicle-details.css";

interface Vehicle {
  id: number;
  name: string;
  type: "car" | "motorcycle" | "bicycle" | "boat";
  images: string[];
  pricePerDay: number;
  location: string;
  rating: number;
  reviews: number;
  seats: number;
  fuelType?: string;
  available: boolean;
  description: string;
  features: string[];
}

const VehicleDetailsPage: React.FC = () => {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [totalDays, setTotalDays] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, fetch from API
    setTimeout(() => {
      const mockVehicle: Vehicle = {
        id: Number.parseInt(id || "1"),
        name: "Tesla Model 3",
        type: "car",
        images: [
          "/placeholder.svg?height=400&width=600&text=Tesla+Model+3+Front",
          "/placeholder.svg?height=400&width=600&text=Tesla+Model+3+Side",
          "/placeholder.svg?height=400&width=600&text=Tesla+Model+3+Interior",
          "/placeholder.svg?height=400&width=600&text=Tesla+Model+3+Rear",
        ],
        pricePerDay: 95,
        location: "Chicago",
        rating: 4.9,
        reviews: 124,
        seats: 5,
        fuelType: "Electric",
        available: true,
        description:
          "Experience the future of driving with the Tesla Model 3. This all-electric vehicle offers exceptional range, performance, and advanced technology features. Perfect for eco-conscious travelers who want style and comfort.",
        features: [
          "Autopilot",
          "All-Electric",
          "Touchscreen Display",
          "Bluetooth Connectivity",
          "Climate Control",
          "Panoramic Roof",
          "Premium Sound System",
          "Supercharger Access",
        ],
      };

      setVehicle(mockVehicle);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays || 1);
    }
  }, [pickupDate, returnDate]);

  if (isLoading) {
    return (
      <div className={`loading-container ${theme}`}>
        <div className="loading-spinner"></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className={`not-found-container ${theme}`}>
        <h2>Vehicle Not Found</h2>
        <p>The vehicle you're looking for doesn't exist or has been removed.</p>
        <Link to="/vehicles" className="back-link">
          <FaArrowLeft /> Back to Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className={`vehicle-details-page ${theme}`}>
      <div className="back-navigation">
        <Link to="/vehicles" className="back-link">
          <FaArrowLeft /> Back to Vehicles
        </Link>
      </div>

      <div className="vehicle-details-container">
        <div className="vehicle-gallery">
          <div className="main-image">
            <img
              src={vehicle.images[selectedImage] || "/placeholder.svg"}
              alt={`${vehicle.name} view ${selectedImage + 1}`}
            />
            <div className="image-actions">
              <button className="action-button">
                <FaHeart /> Save
              </button>
              <button className="action-button">
                <FaShare /> Share
              </button>
            </div>
          </div>

          <div className="thumbnail-gallery">
            {vehicle.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${
                  selectedImage === index ? "active" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${vehicle.name} thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="vehicle-info">
          <div className="vehicle-header">
            <h1>{vehicle.name}</h1>
            <div className="vehicle-meta">
              <div className="rating">
                <FaStar /> {vehicle.rating} ({vehicle.reviews} reviews)
              </div>
              <div className="location">
                <FaMapMarkerAlt /> {vehicle.location}
              </div>
            </div>
          </div>

          <div className="vehicle-description">
            <h2>About this vehicle</h2>
            <p>{vehicle.description}</p>
          </div>

          <div className="vehicle-specs">
            <div className="spec-item">
              <FaUsers className="spec-icon" />
              <div className="spec-detail">
                <span className="spec-label">Capacity</span>
                <span className="spec-value">
                  {vehicle.seats} {vehicle.seats > 1 ? "people" : "person"}
                </span>
              </div>
            </div>

            {vehicle.fuelType && (
              <div className="spec-item">
                <FaGasPump className="spec-icon" />
                <div className="spec-detail">
                  <span className="spec-label">Fuel Type</span>
                  <span className="spec-value">{vehicle.fuelType}</span>
                </div>
              </div>
            )}
          </div>

          <div className="vehicle-features">
            <h2>Features</h2>
            <div className="features-grid">
              {vehicle.features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <FaCheck className="feature-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-panel">
          <div className="booking-header">
            <div className="booking-price">
              <span className="price">${vehicle.pricePerDay}</span>
              <span className="period">/ day</span>
            </div>
            <div className="booking-rating">
              <FaStar /> {vehicle.rating}
            </div>
          </div>

          <form className="booking-form">
            <div className="date-inputs">
              <div className="form-group">
                <label>
                  <FaCalendarAlt /> Pick-up Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaCalendarAlt /> Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={pickupDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-item">
                <span>
                  ${vehicle.pricePerDay} x {totalDays} days
                </span>
                <span>${vehicle.pricePerDay * totalDays}</span>
              </div>
              <div className="summary-item">
                <span>Service fee</span>
                <span>
                  ${Math.round(vehicle.pricePerDay * totalDays * 0.1)}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>
                  $
                  {vehicle.pricePerDay * totalDays +
                    Math.round(vehicle.pricePerDay * totalDays * 0.1)}
                </span>
              </div>
            </div>

            <button type="submit" className="book-button">
              Reserve Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
