import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [wantsEmailReport, setWantsEmailReport] = useState(false);
  const navigate = useNavigate();
  const handleLogin = (event) => {
    event.preventDefault();

    const phoneRegex = /^\+250\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Error: Phone number must start with +250 and have 9 more digits.");
      return;
    }

    if (role === "farmer") {
      setIsLoggedIn(true);
      navigate("/farmer");
    } else if (role === "agronomist") {
      setIsLoggedIn(true);
      navigate("/agronomist");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">CropGuard Rwanda Login</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input-padded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (For SMS Alerts)</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+250..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="role-selector-box">
            <label className="form-label">Role:</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="farmer">Farmer</option>
              <option value="agronomist">Agronomist</option>
            </select>
          </div>
          {/*This is to allow farmer to receive monthly email report*/}
          {role === "farmer" && (
            <div
              className="form-group"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <input
                type="checkbox"
                id="emailReport"
                checked={wantsEmailReport}
                onChange={(e) => setWantsEmailReport(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label
                htmlFor="emailReport"
                style={{
                  fontSize: "14px",
                  color: "#555",
                  cursor: "pointer",
                  margin: 0,
                }}
              >
                Send me a free monthly crop health report via email
              </label>
            </div>
          )}

          <button type="submit" className="submit-button">
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
