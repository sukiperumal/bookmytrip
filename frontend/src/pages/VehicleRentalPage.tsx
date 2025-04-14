"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaSearch,
  FaCar,
  FaMotorcycle,
  FaBicycle,
  FaShip,
  FaStar,
  FaMapMarkerAlt,
  FaUsers,
  FaGasPump,
  FaExclamationCircle,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/vehicle-rental.css";

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
  seats: number;
  fuelType?: string;
  available: boolean;
}

interface LocationFilter {
  id: string;
  name: string;
}

const VehicleRentalPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationFilter[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Build query params based on filters
        let queryParams = new URLSearchParams();

        if (selectedType !== "all") {
          queryParams.append("type", selectedType);
        }

        if (selectedLocation !== "all") {
          queryParams.append("location", selectedLocation);
        }

        if (priceRange[0] > 0) {
          queryParams.append("minPrice", priceRange[0].toString());
        }

        if (priceRange[1] < 500) {
          queryParams.append("maxPrice", priceRange[1].toString());
        }

        const response = await fetch(`/api/vehicles?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const data = await response.json();
        setVehicles(data.vehicles || data);
        setError(null);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load vehicles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data = await response.json();
        const locationsList = data.locations || data;
        setLocations(
          locationsList.map((loc: any) => ({
            id: loc._id,
            name: `${loc.name}, ${loc.address.city}`,
          }))
        );
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };

    fetchVehicles();
    fetchLocations();
  }, [selectedType, selectedLocation, priceRange]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = Number.parseInt(e.target.value);
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[index] = newValue;
    setPriceRange(newPriceRange);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location?.address?.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false;

    return matchesSearch;
  });

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "car":
        return <FaCar />;
      case "motorcycle":
        return <FaMotorcycle />;
      case "bicycle":
        return <FaBicycle />;
      case "boat":
        return <FaShip />;
      default:
        return <FaCar />;
    }
  };

  return (
    <div className={`vehicle-rental-page ${theme}`}>
      <div className="page-header">
        <h1>Find Your Perfect Ride</h1>
        <p>
          Choose from our wide selection of vehicles for your next adventure
        </p>
      </div>

      <div className="search-filter-container">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by vehicle name or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="filter-toggle" onClick={toggleFilter}>
          <FaFilter /> Filters
        </button>
      </div>

      <div className={`filter-panel ${isFilterOpen ? "open" : ""}`}>
        <div className="filter-section">
          <h3>Vehicle Type</h3>
          <div className="vehicle-types">
            <button
              className={`type-button ${
                selectedType === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedType("all")}
            >
              All
            </button>
            <button
              className={`type-button ${
                selectedType === "car" ? "active" : ""
              }`}
              onClick={() => setSelectedType("car")}
            >
              <FaCar /> Cars
            </button>
            <button
              className={`type-button ${
                selectedType === "motorcycle" ? "active" : ""
              }`}
              onClick={() => setSelectedType("motorcycle")}
            >
              <FaMotorcycle /> Motorcycles
            </button>
            <button
              className={`type-button ${
                selectedType === "bicycle" ? "active" : ""
              }`}
              onClick={() => setSelectedType("bicycle")}
            >
              <FaBicycle /> Bicycles
            </button>
            <button
              className={`type-button ${
                selectedType === "boat" ? "active" : ""
              }`}
              onClick={() => setSelectedType("boat")}
            >
              <FaShip /> Boats
            </button>
          </div>
        </div>

        <div className="filter-section">
          <h3>Location</h3>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="location-select"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <h3>Price Range (per day)</h3>
          <div className="price-range">
            <div className="range-values">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <div className="range-sliders">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
              />
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vehicles...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <FaExclamationCircle />
          <p>{error}</p>
        </div>
      ) : (
        <div className="vehicles-grid">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <div className="vehicle-card" key={vehicle._id}>
                <div className="vehicle-image">
                  <img
                    src={
                      vehicle.images && vehicle.images.length > 0
                        ? `/uploads/vehicles/${vehicle.images[0]}`
                        : "/placeholder.svg?height=200&width=300&text=Vehicle+Image"
                    }
                    alt={vehicle.name}
                  />
                  <div className="vehicle-type-badge">
                    {getVehicleIcon(vehicle.type)}
                    <span>
                      {vehicle.type.charAt(0).toUpperCase() +
                        vehicle.type.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="vehicle-details">
                  <div className="vehicle-name-rating">
                    <h3>{vehicle.name}</h3>
                    <div className="vehicle-rating">
                      <FaStar /> <span>{vehicle.rating}</span>
                    </div>
                  </div>

                  <div className="vehicle-location">
                    <FaMapMarkerAlt />{" "}
                    {vehicle.location?.address?.city || "N/A"}
                  </div>

                  <div className="vehicle-features">
                    <div className="feature">
                      <FaUsers /> {vehicle.seats}{" "}
                      {vehicle.seats > 1 ? "seats" : "seat"}
                    </div>
                    {vehicle.fuelType && (
                      <div className="feature">
                        <FaGasPump /> {vehicle.fuelType}
                      </div>
                    )}
                  </div>

                  <div className="vehicle-price-action">
                    <div className="vehicle-price">
                      <span className="price">${vehicle.pricePerDay}</span>
                      <span className="period">/ day</span>
                    </div>

                    <Link
                      to={`/vehicles/${vehicle._id}`}
                      className="view-details-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No vehicles found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleRentalPage;
