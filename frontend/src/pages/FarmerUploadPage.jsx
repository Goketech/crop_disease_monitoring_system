import React, { useState } from "react";
import axios from "axios";

function FarmerUploadPage() {
  const [cropType, setCropType] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!imageFile) {
      setError("Please select an image.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("crop_type", cropType);
      formData.append("description", description);
      formData.append("district", district);
      const res = await axios.post("/api/reports/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus(res.data.message || "Report submitted.");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
  }

  return (
    <section className="page">
      <h1>Farmer Image Upload</h1>
      <div className="layout-two-column">
        <form onSubmit={handleSubmit} className="card form-card">
          <label>
            Crop type
            <input
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
            />
          </label>
          <label>
            District
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </label>
          <label>
            Description (optional)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <label>
            Leaf image
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {error && <p className="error-text">{error}</p>}
          {status && <p className="success-text">{status}</p>}
          <button type="submit">Submit report</button>
        </form>
        <div className="card preview-card">
          <h2>Preview</h2>
          {preview ? (
            <img src={preview} alt="Leaf preview" className="preview-image" />
          ) : (
            <p>No image selected yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default FarmerUploadPage;

