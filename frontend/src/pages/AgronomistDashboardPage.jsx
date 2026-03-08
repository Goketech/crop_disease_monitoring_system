import React, { useEffect, useState } from "react";
import axios from "axios";

function AgronomistDashboardPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState({
    verified_disease: "",
    treatment_advice: "",
    severity_level: "medium",
    ml_agreement: true
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await axios.get("/api/reports/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      }
    }
    if (token) {
      loadReports();
    }
  }, [token]);

  async function loadReportDetails(reportId) {
    setError("");
    setStatus("");
    try {
      const res = await axios.get(`/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReport(res.data.data);
      if (res.data.data.feedback) {
        setFeedback({
          verified_disease: res.data.data.feedback.verified_disease || "",
          treatment_advice: res.data.data.feedback.treatment_advice || "",
          severity_level: res.data.data.feedback.severity_level || "medium",
          ml_agreement: res.data.data.feedback.ml_agreement ?? true
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report");
    }
  }

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (!selectedReport) return;
    setError("");
    setStatus("");
    try {
      await axios.post(
        `/api/reports/${selectedReport.report_id}/feedback`,
        feedback,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStatus("Feedback saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save feedback");
    }
  }

  return (
    <section className="page">
      <h1>Agronomist Dashboard</h1>
      <div className="layout-two-column">
        <div className="card list-card">
          <h2>Pending Reports</h2>
          <ul className="report-list">
            {reports.map((r) => (
              <li key={r.report_id}>
                <button type="button" onClick={() => loadReportDetails(r.report_id)}>
                  #{r.report_id} — {r.crop_type} ({r.status})
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card detail-card">
          {selectedReport ? (
            <>
              <h2>Report #{selectedReport.report_id}</h2>
              <p>
                <strong>Crop:</strong> {selectedReport.crop_type}
              </p>
              <p>
                <strong>District:</strong> {selectedReport.district}
              </p>
              {selectedReport.ml_diagnosis && (
                <div className="ml-box">
                  <h3>ML Suggestion</h3>
                  <p>
                    {selectedReport.ml_diagnosis.predicted_disease} (
                    {(selectedReport.ml_diagnosis.confidence_score * 100).toFixed(1)}%)
                  </p>
                </div>
              )}
              <form onSubmit={handleFeedbackSubmit} className="form-card">
                <h3>Agronomist Feedback</h3>
                <label>
                  Verified disease
                  <input
                    value={feedback.verified_disease}
                    onChange={(e) =>
                      setFeedback((f) => ({ ...f, verified_disease: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Treatment advice
                  <textarea
                    value={feedback.treatment_advice}
                    onChange={(e) =>
                      setFeedback((f) => ({ ...f, treatment_advice: e.target.value }))
                    }
                    rows={4}
                  />
                </label>
                <label>
                  Severity level
                  <select
                    value={feedback.severity_level}
                    onChange={(e) =>
                      setFeedback((f) => ({ ...f, severity_level: e.target.value }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={feedback.ml_agreement}
                    onChange={(e) =>
                      setFeedback((f) => ({ ...f, ml_agreement: e.target.checked }))
                    }
                  />
                  ML suggestion was accurate
                </label>
                {error && <p className="error-text">{error}</p>}
                {status && <p className="success-text">{status}</p>}
                <button type="submit">Save feedback</button>
              </form>
            </>
          ) : (
            <p>Select a report from the left to view details.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AgronomistDashboardPage;

