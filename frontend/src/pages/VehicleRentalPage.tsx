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
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/vehicle-rental.css";

interface Vehicle {
  id: number;
  name: string;
  type: "car" | "motorcycle" | "bicycle" | "boat";
  image: string;
  pricePerDay: number;
  location: string;
  rating: number;
  seats: number;
  fuelType?: string;
  available: boolean;
}

const VehicleRentalPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockVehicles: Vehicle[] = [
      {
        id: 1,
        name: "Toyota Camry",
        type: "car",
        image: "/placeholder.svg?height=200&width=300&text=Toyota+Camry",
        pricePerDay: 65,
        location: "New York",
        rating: 4.8,
        seats: 5,
        fuelType: "Hybrid",
        available: true,
      },
      {
        id: 2,
        name: "Honda CBR",
        type: "motorcycle",
        image: "/placeholder.svg?height=200&width=300&text=Honda+CBR",
        pricePerDay: 45,
        location: "Los Angeles",
        rating: 4.6,
        seats: 2,
        fuelType: "Petrol",
        available: true,
      },
      {
        id: 3,
        name: "Trek Mountain Bike",
        type: "bicycle",
        image: "/placeholder.svg?height=200&width=300&text=Trek+Bike",
        pricePerDay: 25,
        location: "San Francisco",
        rating: 4.9,
        seats: 1,
        available: true,
      },
      {
        id: 4,
        name: "Speedboat 2000",
        type: "boat",
        image: "/placeholder.svg?height=200&width=300&text=Speedboat",
        pricePerDay: 150,
        location: "Miami",
        rating: 4.7,
        seats: 6,
        fuelType: "Petrol",
        available: true,
      },
      {
        id: 5,
        name: "Tesla Model 3",
        type: "car",
        image: "/placeholder.svg?height=200&width=300&text=Tesla+Model+3",
        pricePerDay: 95,
        location: "Chicago",
        rating: 4.9,
        seats: 5,
        fuelType: "Electric",
        available: true,
      },
      {
        id: 6,
        name: "Ducati Monster",
        type: "motorcycle",
        image: "/placeholder.svg?height=200&width=300&text=Ducati+Monster",
        pricePerDay: 75,
        location: "Las Vegas",
        rating: 4.5,
        seats: 2,
        fuelType: "Petrol",
        available: true,
      },
      {
        id: 7,
        name: "Cannondale Road Bike",
        type: "bicycle",
        image: "/placeholder.svg?height=200&width=300&text=Cannondale+Bike",
        pricePerDay: 20,
        location: "Portland",
        rating: 4.7,
        seats: 1,
        available: true,
      },
      {
        id: 8,
        name: "Yacht Explorer",
        type: "boat",
        image: "/placeholder.svg?height=200&width=300&text=Yacht+Explorer",
        pricePerDay: 350,
        location: "San Diego",
        rating: 4.8,
        seats: 12,
        fuelType: "Diesel",
        available: true,
      },
    ];

    setVehicles(mockVehicles);
  }, []);

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
      vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || vehicle.type === selectedType;
    const matchesPrice =
      vehicle.pricePerDay >= priceRange[0] &&
      vehicle.pricePerDay <= priceRange[1];

    return matchesSearch && matchesType && matchesPrice;
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

      <div className="vehicles-grid">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div className="vehicle-card" key={vehicle.id}>
              <div className="vehicle-image">
                <img
                  src={vehicle.image || "/placeholder.svg"}
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
                  <FaMapMarkerAlt /> {vehicle.location}
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
                    to={`/vehicles/${vehicle.id}`}
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
    </div>
  );
};

export default VehicleRentalPage;
