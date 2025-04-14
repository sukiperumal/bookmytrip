"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebook,
  FaApple,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/login.css";

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/signup logic
    console.log(isLogin ? "Login" : "Signup", { email, password, name });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="login-container">
        <div className="login-image-container">
          <img
            src="/placeholder.svg?height=600&width=600&text=Travel+Adventures"
            alt="Travel adventures"
            className="login-image"
          />
          <div className="image-overlay">
            <h2>Discover the World with BookMyTrip</h2>
            <p>Rent vehicles and get support for your perfect journey</p>
          </div>
        </div>

        <div className="login-form-container">
          <div className="form-header">
            <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p>
              {isLogin
                ? "Sign in to continue your journey"
                : "Join us and start your adventure"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            )}

            <button type="submit" className="auth-button">
              {isLogin ? "Sign In" : "Create Account"}
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-auth">
              <button type="button" className="social-button google">
                <FaGoogle /> Google
              </button>
              <button type="button" className="social-button facebook">
                <FaFacebook /> Facebook
              </button>
              <button type="button" className="social-button apple">
                <FaApple /> Apple
              </button>
            </div>

            <div className="auth-switch">
              <p>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="switch-button"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
