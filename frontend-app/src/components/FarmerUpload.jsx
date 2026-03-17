import { useState } from "react";

function FarmerUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // This lines creates temporary visual link to the image blob
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Success! Your crop issue has been sent to the District Agronomist.");
  };

  return (
    <div className="upload-page-container">
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

          {/* The Image Preview Area */}
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
              placeholder="E.g., The leaves have yellow spots and are turning brown..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>

          <button type="submit" className="submit-button">
            Send to Agronomist
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerUpload;
