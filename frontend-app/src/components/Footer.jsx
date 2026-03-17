// src/components/Footer.jsx

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} CropGuard Rwanda. Protecting Harvests, Empowering
          Farmers.
        </p>
        <p className="footer-subtext">
          Designed for agronomists and local smallhold farmers.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
