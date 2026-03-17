import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="main-header">
      <div className="logo-section">
        <img
          src="../src/images/cropGuardRwanda.png"
          alt="Logo"
          className="logo-img"
        />
        <span className="logo-text">CropGuard Rwanda</span>
      </div>

      <nav className="navbar">
        <Link to="/" className="navbar-item">
          Home
        </Link>
        <Link to="/about" className="navbar-item">
          About
        </Link>
        <Link to="/login" className="navbar-item highlight">
          Login/Register
        </Link>
      </nav>
    </header>
  );
}

export default Header;
