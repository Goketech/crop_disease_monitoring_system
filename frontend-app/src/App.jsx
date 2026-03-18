import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import FarmerUpload from "./components/FarmerUpload";
import "./CSS/HomePage.css";
import "./CSS/LoginPage.css";
import "./CSS/Header.css";
import "./CSS/Footer.css";
import "./App.css";
import "./index.css";
import "./CSS/FarmerUpload.css";

function About() {
  return (
    <h2 style={{ textAlign: "center", padding: "50px" }}>About Our Mission</h2>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <div className="app-wrapper">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/about" element={<About />} />

            <Route
              path="/login"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/farmer" element={<FarmerUpload />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
