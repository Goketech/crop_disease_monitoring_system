// src/components/HomePage.jsx
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-container">
      {/* 1. HERO SECTION (Conversion focused) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">
            Protecting Harvests.
            <br /> Empowering Farmers.
          </h1>
          <p className="hero-description">
            Connecting you instantly to expert district agronomists for faster
            disease diagnosis and automated phosphorous early-warning alerts
            across Rwanda.
          </p>

          {/* Big Green Call-to-Action (CTA) */}
          <Link to="/login" className="cta-button">
            Register to Protect Your Crop
          </Link>
        </div>
      </section>

      {/* 2. OPTIONAL HOW-IT-WORKS SECTION (Below the fold) */}
      <section className="how-it-works">
        <h2 className="section-title">Prevent Crop Loss in Seconds</h2>
        <div className="steps-container">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Upload a Photo</h3>
            <p>Farmers snap a quick photo of their suspicious-looking leaf.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Instant Analysis</h3>
            <p>AI scans and an agronomist reviews the submission.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>SMS Alert</h3>
            <p>
              You receive the diagnosis & required action steps directly on your
              phone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
