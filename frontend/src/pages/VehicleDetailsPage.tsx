"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  FaExclamationCircle,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/vehicle-details.css";

interface Vehicle {
  _id: string;
  name: string;
  type: "car" | "motorcycle" | "bicycle" | "boat";
  images: string[];
  pricePerDay: number;
  location: {
    _id: string;
    name: string;
    address: {
      city: string;
      country: string;
    };
  };
  rating: number;
  reviews: number;
  seats: number;
  fuelType?: string;
  available: boolean;
  description: string;
  features: string[];
}

interface BookingForm {
  startDate: string;
  endDate: string;
  userId?: string;
  vehicleId: string;
}

const VehicleDetailsPage: React.FC = () => {
  const { theme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [totalDays, setTotalDays] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token && !!user._id;

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vehicles/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle details");
        }

        const data = await response.json();
        setVehicle(data.vehicle || data);
        setError(null);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Redirect to login page
      navigate("/login", { state: { redirectTo: `/vehicles/${id}` } });
      return;
    }

    if (!pickupDate || !returnDate) {
      setBookingError("Please select both pick-up and return dates.");
      return;
    }

    try {
      setSubmitting(true);
      setBookingError(null);

      const bookingData: BookingForm = {
        startDate: pickupDate,
        endDate: returnDate,
        vehicleId: id as string,
        userId: user._id,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Booking failed");
      }

      setBookingSuccess(true);

      // Reset form
      setPickupDate("");
      setReturnDate("");

      // Redirect to user bookings page after 2 seconds
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    } catch (err: any) {
      setBookingError(
        err.message || "Failed to create booking. Please try again."
      );
      console.error("Booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`loading-container ${theme}`}>
        <div className="loading-spinner"></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className={`not-found-container ${theme}`}>
        <h2>Vehicle Not Found</h2>
        <p>
          {error ||
            "The vehicle you're looking for doesn't exist or has been removed."}
        </p>
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
              src={
                vehicle.images && vehicle.images.length > 0
                  ? `/uploads/vehicles/${vehicle.images[selectedImage]}`
                  : "/placeholder.svg?height=400&width=600&text=Vehicle+Image"
              }
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

          {vehicle.images && vehicle.images.length > 1 && (
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
                    src={`/uploads/vehicles/${image}`}
                    alt={`${vehicle.name} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="vehicle-info">
          <div className="vehicle-header">
            <h1>{vehicle.name}</h1>
            <div className="vehicle-meta">
              <div className="rating">
                <FaStar /> {vehicle.rating} ({vehicle.reviews || 0} reviews)
              </div>
              <div className="location">
                <FaMapMarkerAlt /> {vehicle.location?.address?.city || "N/A"}
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

          {vehicle.features && vehicle.features.length > 0 && (
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
          )}
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

          {bookingSuccess ? (
            <div className="booking-success">
              <FaCheck />
              <h3>Booking Successful!</h3>
              <p>
                Your reservation has been confirmed. Redirecting to your
                bookings...
              </p>
            </div>
          ) : (
            <form className="booking-form" onSubmit={handleBooking}>
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

              {bookingError && (
                <div className="booking-error">
                  <FaExclamationCircle />
                  <p>{bookingError}</p>
                </div>
              )}

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

              <button
                type="submit"
                className="book-button"
                disabled={submitting || !vehicle.available}
              >
                {submitting
                  ? "Processing..."
                  : vehicle.available
                  ? "Reserve Now"
                  : "Not Available"}
              </button>

              {!isLoggedIn && (
                <div className="login-notice">
                  <p>You need to log in to book this vehicle</p>
                  <Link to={`/login?redirect=/vehicles/${id}`}>Log in</Link>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
