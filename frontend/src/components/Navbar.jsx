import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">Crop Disease Early Warning</div>
      <nav className="navbar-links">
        <Link to="/login">Login</Link>
        <Link to="/farmer/upload">Farmer Portal</Link>
        <Link to="/agronomist/dashboard">Agronomist Dashboard</Link>
      </nav>
    </header>
  );
}

export default Navbar;

