"use client";

import type React from "react";
import {
  FaMapMarked,
  FaUsers,
  FaCar,
  FaHeadset,
  FaAward,
  FaGlobe,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/about.css";

const AboutPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`about-page ${theme}`}>
      <div className="about-hero">
        <div className="hero-content">
          <h1>About BookMyTrip</h1>
          <p>
            Your trusted partner for vehicle rentals and travel support
            worldwide
          </p>
        </div>
      </div>

      <div className="about-section">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>
            Founded in 2015, BookMyTrip began with a simple mission: to make
            travel more accessible and enjoyable for everyone. What started as a
            small vehicle rental service in a single city has grown into a
            global platform offering a wide range of vehicles and 24/7 support
            to travelers around the world.
          </p>
          <p>
            Our journey has been driven by a passion for exploration and a
            commitment to exceptional service. We believe that the right vehicle
            and proper support can transform a good trip into an unforgettable
            adventure.
          </p>
        </div>
        <div className="about-image">
          <img
            src="/placeholder.svg?height=400&width=600&text=Our+Journey"
            alt="BookMyTrip journey"
          />
        </div>
      </div>

      <div className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <FaUsers />
            </div>
            <h3>Customer First</h3>
            <p>
              We prioritize our customers' needs and satisfaction above all
              else.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <FaAward />
            </div>
            <h3>Quality Service</h3>
            <p>
              We maintain the highest standards in our vehicle fleet and
              customer support.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <FaGlobe />
            </div>
            <h3>Global Perspective</h3>
            <p>
              We embrace diversity and cater to travelers from all backgrounds.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <FaMapMarked />
            </div>
            <h3>Adventure Spirit</h3>
            <p>
              We encourage exploration and help create memorable travel
              experiences.
            </p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">50+</div>
          <div className="stat-label">Countries</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">500+</div>
          <div className="stat-label">Cities</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">10,000+</div>
          <div className="stat-label">Vehicles</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">1M+</div>
          <div className="stat-label">Happy Customers</div>
        </div>
      </div>

      <div className="features-section">
        <h2>What Sets Us Apart</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaCar />
            </div>
            <h3>Diverse Vehicle Selection</h3>
            <p>
              From luxury cars to budget-friendly options, boats to bicycles, we
              have the perfect vehicle for every journey.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaHeadset />
            </div>
            <h3>24/7 Support</h3>
            <p>
              Our dedicated call center ensures you're never alone on your
              journey, providing assistance whenever you need it.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaMapMarked />
            </div>
            <h3>Global Presence</h3>
            <p>
              With locations worldwide, we make it easy to find and book the
              perfect vehicle wherever your travels take you.
            </p>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2>Our Leadership Team</h2>
        <div className="team-grid">
          {[
            {
              name: "Sarah Johnson",
              role: "CEO & Founder",
              image: "/placeholder.svg?height=300&width=300&text=Sarah",
            },
            {
              name: "Michael Chen",
              role: "CTO",
              image: "/placeholder.svg?height=300&width=300&text=Michael",
            },
            {
              name: "Elena Rodriguez",
              role: "COO",
              image: "/placeholder.svg?height=300&width=300&text=Elena",
            },
            {
              name: "David Kim",
              role: "Head of Customer Support",
              image: "/placeholder.svg?height=300&width=300&text=David",
            },
          ].map((member, index) => (
            <div className="team-member" key={index}>
              <div className="member-image">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
