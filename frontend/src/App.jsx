import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FarmerUploadPage from "./pages/FarmerUploadPage";
import AgronomistDashboardPage from "./pages/AgronomistDashboardPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/farmer/upload" element={<FarmerUploadPage />} />
          <Route path="/agronomist/dashboard" element={<AgronomistDashboardPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

