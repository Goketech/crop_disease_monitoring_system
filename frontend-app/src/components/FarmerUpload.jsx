import { useState } from "react";

function FarmerUpload() {
  const [activeTab, setActiveTab] = useState("upload");

  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsAnalyzing(true);
    setAiDiagnosis(null);
    setTimeout(() => {
      const fakeApiResponse = {
        disease: "Late Blight",
        confidence: "92%",
        advice:
          "Preliminary AI scan complete. Avoid overhead watering. An agronomist has been notified for final verification.",
      };
      setAiDiagnosis(fakeApiResponse);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h3 className="sidebar-title">Farmer Menu</h3>
        <ul className="sidebar-menu">
          <li
            className={activeTab === "upload" ? "active-tab" : ""}
            onClick={() => setActiveTab("upload")}
          >
            📸 New Scan
          </li>
          <li
            className={activeTab === "history" ? "active-tab" : ""}
            onClick={() => setActiveTab("history")}
          >
            🗂️ Past Scans
          </li>
          <li
            className={activeTab === "reports" ? "active-tab" : ""}
            onClick={() => setActiveTab("reports")}
          >
            👨‍🔬 Agronomist Reports
          </li>
          <li
            className={activeTab === "ai-reports" ? "active-tab" : ""}
            onClick={() => setActiveTab("ai-reports")}
          >
            🤖 AI Diagnosis
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {activeTab === "upload" && (
          <div className="upload-card">
            <h2 className="upload-title">Report a Crop Issue</h2>
            <p className="upload-subtitle">
              Upload a clear photo of the diseased leaf.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                  required
                />
              </div>
              {selectedImage && (
                <div className="image-preview-box">
                  <img
                    src={selectedImage}
                    alt="Crop Preview"
                    className="preview-image"
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">
                  Describe the Problem (Optional)
                </label>
                <textarea
                  className="form-input textarea-input"
                  placeholder="E.g., The leaves have yellow spots..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                />
              </div>
              {isAnalyzing ? (
                <div className="analyzing-text">
                  Scanning leaf with ML Model... Please wait...
                </div>
              ) : (
                <button type="submit" className="submit-button">
                  Analyze & Send to Agronomist
                </button>
              )}
              {aiDiagnosis && (
                <div className="diagnosis-box">
                  <h3>🤖 AI Preliminary Diagnosis</h3>
                  <p>
                    <strong>Detected:</strong> {aiDiagnosis.disease} (
                    {aiDiagnosis.confidence})
                  </p>
                  <p className="diagnosis-advice">{aiDiagnosis.advice}</p>
                </div>
              )}
            </form>
          </div>
        )}
        {activeTab === "history" && (
          <div className="tab-placeholder-card">
            <h2>Your Past Scans</h2>
            <p>A record of your previous uploads will go here.</p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="tab-placeholder-card">
            <h2>Agronomist Messages</h2>
            <p>
              Official SMS treatment plans from your local agronomist will
              appear here.
            </p>
          </div>
        )}

        {activeTab === "ai-reports" && (
          <div className="tab-placeholder-card">
            <h2>🤖 AI Diagnosis Reports</h2>
            <p>A history of instant AI diagnosis result will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default FarmerUpload;
