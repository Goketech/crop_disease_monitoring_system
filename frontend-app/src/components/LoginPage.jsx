import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = (event) => {
    event.preventDefault();

    const phoneRegex = /^\+250\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Error: Phone number must start with +250 and have 9 more digits.");
      return;
    }

    //alert(`Success! Logging in ${email} as a ${role} with phone ${phone}`);
    // 3. The Navigation to farmer page
    // When my teamate finishes API, password check will come here. Right now, I just I assume login is successfull.
    if (role === "farmer") {
      setIsLoggedIn(true);
      navigate("/farmer");
    } else if (role === "agronomist") {
      alert("We haven't built the Agronomist Dashboard yet!");
      // Later this will be: navigate("/dashboard");
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

          <button type="submit" className="submit-button">
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
