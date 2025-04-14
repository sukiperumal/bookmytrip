"use client";

import type React from "react";
import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaComments,
  FaHeadset,
  FaQuestionCircle,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/support.css";

interface FAQ {
  question: string;
  answer: string;
}

const SupportPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"call" | "chat" | "faq">("call");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCallbackRequested, setIsCallbackRequested] = useState(false);

  const faqs: FAQ[] = [
    {
      question: "How do I modify or cancel my vehicle reservation?",
      answer:
        'You can modify or cancel your reservation by logging into your account and navigating to "My Bookings". From there, select the reservation you wish to change and follow the prompts. Please note that cancellation policies vary depending on the vehicle and timing.',
    },
    {
      question: "What documents do I need to rent a vehicle?",
      answer:
        "You will need a valid driver's license, a credit card in your name, and proof of insurance. For international rentals, you may also need an International Driving Permit. Specific requirements may vary by location and vehicle type.",
    },
    {
      question: "Is there a security deposit required?",
      answer:
        "Yes, most rentals require a security deposit which is held on your credit card. The amount varies depending on the vehicle type. The deposit is fully refundable upon return of the vehicle in its original condition.",
    },
    {
      question:
        "Can I pick up the vehicle in one location and return it to another?",
      answer:
        "Yes, one-way rentals are available for most vehicles, though additional fees may apply. You can specify different pickup and drop-off locations during the booking process.",
    },
    {
      question: "What happens if the vehicle breaks down?",
      answer:
        "All our vehicles come with 24/7 roadside assistance. In case of a breakdown, call our emergency support number provided in your booking confirmation. We will arrange for assistance or a replacement vehicle as quickly as possible.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCallbackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the request to the backend
    setIsCallbackRequested(true);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would initiate a chat session
    console.log("Chat initiated with message:", message);
  };

  return (
    <div className={`support-page ${theme}`}>
      <div className="support-header">
        <h1>24/7 Customer Support</h1>
        <p>We're here to help you with any questions or issues you may have</p>
      </div>

      <div className="support-container">
        <div className="support-tabs">
          <button
            className={`tab-button ${activeTab === "call" ? "active" : ""}`}
            onClick={() => setActiveTab("call")}
          >
            <FaPhone /> Call Center
          </button>
          <button
            className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            <FaComments /> Live Chat
          </button>
          <button
            className={`tab-button ${activeTab === "faq" ? "active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            <FaQuestionCircle /> FAQs
          </button>
        </div>

        <div className="support-content">
          {activeTab === "call" && (
            <div className="call-center-tab">
              <div className="support-info">
                <div className="info-card">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <h3>Call Us Directly</h3>
                  <p>Our support team is available 24/7</p>
                  <a href="tel:+15551234567" className="contact-button">
                    +1 (555) 123-4567
                  </a>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FaHeadset />
                  </div>
                  <h3>Request a Callback</h3>
                  <p>We'll call you back as soon as possible</p>

                  {!isCallbackRequested ? (
                    <form
                      onSubmit={handleCallbackRequest}
                      className="callback-form"
                    >
                      <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>

                      <button type="submit" className="submit-button">
                        Request Callback
                      </button>
                    </form>
                  ) : (
                    <div className="callback-confirmation">
                      <FaHeadset className="confirmation-icon" />
                      <h4>Callback Requested</h4>
                      <p>We'll call you back at {phone} as soon as possible.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="support-hours">
                <h3>Call Center Hours</h3>
                <div className="hours-grid">
                  <div className="day">Monday - Friday</div>
                  <div className="time">24 hours</div>
                  <div className="day">Saturday</div>
                  <div className="time">24 hours</div>
                  <div className="day">Sunday</div>
                  <div className="time">24 hours</div>
                  <div className="day">Holidays</div>
                  <div className="time">24 hours</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="live-chat-tab">
              <div className="chat-intro">
                <div className="chat-icon">
                  <FaComments />
                </div>
                <h3>Start a Live Chat</h3>
                <p>Connect with our support team instantly</p>
              </div>

              <form onSubmit={handleChatSubmit} className="chat-form">
                <div className="form-group">
                  <label htmlFor="chat-name">Your Name</label>
                  <input
                    id="chat-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="chat-email">Email Address</label>
                  <input
                    id="chat-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="chat-message">How can we help you?</label>
                  <textarea
                    id="chat-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  Start Chat <FaArrowRight />
                </button>
              </form>

              <div className="chat-alternative">
                <h4>Prefer email?</h4>
                <p>
                  You can also reach us at{" "}
                  <a href="mailto:support@bookmytrip.com">
                    support@bookmytrip.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="faq-tab">
              <div className="faq-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="faq-list">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <details className="faq-item" key={index}>
                      <summary className="faq-question">{faq.question}</summary>
                      <div className="faq-answer">{faq.answer}</div>
                    </details>
                  ))
                ) : (
                  <div className="no-results">
                    <FaQuestionCircle />
                    <h3>No matching FAQs found</h3>
                    <p>Try a different search term or contact us directly</p>
                  </div>
                )}
              </div>

              <div className="faq-contact">
                <h3>Still have questions?</h3>
                <p>Contact us directly for personalized assistance</p>
                <div className="contact-options">
                  <a href="tel:+15551234567" className="contact-option">
                    <FaPhone /> Call Us
                  </a>
                  <a
                    href="mailto:support@bookmytrip.com"
                    className="contact-option"
                  >
                    <FaEnvelope /> Email Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
