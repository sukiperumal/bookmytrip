"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCar,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaArrowLeft,
  FaExclamationCircle,
  FaTrash,
  FaInfoCircle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/my-bookings.css";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  images: string[];
  pricePerDay: number;
}

interface Location {
  _id: string;
  name: string;
  address: {
    city: string;
    country: string;
  };
}

interface Booking {
  _id: string;
  vehicle: Vehicle;
  location: Location;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

const MyBookingsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Get user and token from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!token && !!user._id;

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      navigate("/login", { state: { redirectTo: "/my-bookings" } });
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.bookings || data);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isLoggedIn, navigate, token]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      setCancelError(null);

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cancellation failed");
      }

      // Update bookings list
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" as const }
            : booking
        )
      );

      setCancelSuccess(
        `Booking #${bookingId.slice(-6)} has been cancelled successfully`
      );

      // Clear success message after 3 seconds
      setTimeout(() => setCancelSuccess(null), 3000);
    } catch (err: any) {
      setCancelError(
        err.message || "Failed to cancel booking. Please try again."
      );
      console.error("Cancellation error:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className={`loading-container ${theme}`}>
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className={`my-bookings-page ${theme}`}>
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Manage your vehicle reservations</p>
      </div>

      <div className="back-navigation">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      {error ? (
        <div className="error-container">
          <FaExclamationCircle />
          <p>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <FaInfoCircle />
          <h2>No Bookings Found</h2>
          <p>You haven't made any bookings yet.</p>
          <Link to="/vehicles" className="browse-vehicles-btn">
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div className="bookings-container">
          {cancelSuccess && (
            <div className="cancel-success-message">
              <FaCheck />
              <p>{cancelSuccess}</p>
            </div>
          )}

          {cancelError && (
            <div className="cancel-error-message">
              <FaTimes />
              <p>{cancelError}</p>
            </div>
          )}

          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`booking-card ${
                booking.status === "cancelled" ? "cancelled" : ""
              }`}
            >
              <div className="booking-card-header">
                <div className="booking-id">
                  Booking #{booking._id.slice(-6)}
                </div>
                <div
                  className={`booking-status ${getStatusBadgeClass(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </div>
              </div>

              <div className="booking-content">
                <div className="booking-vehicle">
                  <div className="vehicle-image">
                    <img
                      src={
                        booking.vehicle.images &&
                        booking.vehicle.images.length > 0
                          ? `/uploads/vehicles/${booking.vehicle.images[0]}`
                          : "/placeholder.svg?height=100&width=150&text=Vehicle"
                      }
                      alt={booking.vehicle.name}
                    />
                  </div>
                  <div className="vehicle-info">
                    <h3>{booking.vehicle.name}</h3>
                    <div className="vehicle-type">
                      <FaCar />
                      <span>
                        {booking.vehicle.type.charAt(0).toUpperCase() +
                          booking.vehicle.type.slice(1)}
                      </span>
                    </div>
                    <Link
                      to={`/vehicles/${booking.vehicle._id}`}
                      className="view-vehicle-link"
                    >
                      View Vehicle
                    </Link>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="booking-dates">
                    <div className="booking-detail">
                      <FaCalendarAlt />
                      <div>
                        <span className="detail-label">Pick-up Date</span>
                        <span className="detail-value">
                          {formatDate(booking.startDate)}
                        </span>
                      </div>
                    </div>
                    <div className="booking-detail">
                      <FaCalendarAlt />
                      <div>
                        <span className="detail-label">Return Date</span>
                        <span className="detail-value">
                          {formatDate(booking.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <div className="booking-detail">
                      <FaClock />
                      <div>
                        <span className="detail-label">Duration</span>
                        <span className="detail-value">
                          {calculateDuration(
                            booking.startDate,
                            booking.endDate
                          )}{" "}
                          days
                        </span>
                      </div>
                    </div>
                    <div className="booking-detail">
                      <FaMapMarkerAlt />
                      <div>
                        <span className="detail-label">Location</span>
                        <span className="detail-value">
                          {booking.location
                            ? `${booking.location.name}, ${booking.location.address.city}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-pricing">
                    <div className="booking-detail">
                      <FaMoneyBillWave />
                      <div>
                        <span className="detail-label">Total Price</span>
                        <span className="detail-value price">
                          ${booking.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-actions">
                {booking.status !== "cancelled" && (
                  <button
                    className="cancel-booking-btn"
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={cancellingId === booking._id}
                  >
                    {cancellingId === booking._id ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <FaTrash /> Cancel Booking
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
