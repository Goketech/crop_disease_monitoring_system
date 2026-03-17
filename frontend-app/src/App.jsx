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
/*function Home() {
  return (
    <h1 style={{ textAlign: "center", padding: "50px" }}>
      Welcome to CropGuard Rwanda
    </h1>
  );
}*/

function About() {
  return (
    <h2 style={{ textAlign: "center", padding: "50px" }}>About Our Mission</h2>
  );
}

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        {/* 3. The invisible spring! This pushes the footer down. */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/*<Route path="/" element={<Home />} />*/}
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/farmer" element={<FarmerUpload />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
