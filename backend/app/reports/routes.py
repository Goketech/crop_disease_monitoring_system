import os
import uuid
from datetime import datetime

from flask import current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

from .. import db
from ..models import AgronomistFeedback, CropReport, MlDiagnosis, User
from ..schemas import FeedbackSchema, UploadReportSchema
from . import reports_bp

upload_schema = UploadReportSchema()
feedback_schema = FeedbackSchema()

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}


def _allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@reports_bp.post("/upload")
@jwt_required()
def upload_report():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "farmer":
        return jsonify({"success": False, "message": "Only farmers can upload"}), 403

    if "image" not in request.files:
        return jsonify({"success": False, "message": "Image file is required"}), 400

    image = request.files["image"]
    if image.filename == "" or not _allowed_file(image.filename):
        return jsonify({"success": False, "message": "Invalid image file"}), 400

    form_data = {
        "crop_type": request.form.get("crop_type"),
        "description": request.form.get("description"),
        "district": request.form.get("district") or user.district,
    }
    errors = upload_schema.validate(form_data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    upload_dir = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_dir, exist_ok=True)

    ext = image.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(upload_dir, secure_filename(filename))
    image.save(filepath)

    report = CropReport(
        farmer_id=user.user_id,
        crop_type=form_data["crop_type"],
        description=form_data.get("description"),
        image_path=filepath,
        district=form_data["district"],
        status="pending",
        submitted_at=datetime.utcnow(),
    )
    db.session.add(report)
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "data": {
                    "report_id": report.report_id,
                    "status": report.status,
                },
                "message": "Report submitted; ML diagnosis will run shortly.",
            }
        ),
        202,
    )


@reports_bp.get("/")
@jwt_required()
def list_reports():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    role = user.role

    cursor = request.args.get("cursor", type=int)
    limit = request.args.get("limit", default=10, type=int)

    query = CropReport.query.order_by(CropReport.submitted_at.desc())

    if role == "farmer":
        query = query.filter_by(farmer_id=user.user_id)
    if cursor:
        query = query.filter(CropReport.report_id < cursor)

    items = query.limit(limit + 1).all()
    has_next = len(items) > limit
    items = items[:limit]

    data = []
    for r in items:
        data.append(
            {
                "report_id": r.report_id,
                "crop_type": r.crop_type,
                "status": r.status,
                "district": r.district,
                "submitted_at": r.submitted_at.isoformat(),
            }
        )

    next_cursor = items[-1].report_id if has_next and items else None

    return jsonify({"success": True, "data": data, "next_cursor": next_cursor}), 200


@reports_bp.get("/<int:report_id>")
@jwt_required()
def get_report(report_id: int):
    report = CropReport.query.get_or_404(report_id)
    ml = MlDiagnosis.query.filter_by(report_id=report.report_id).first()
    feedback = AgronomistFeedback.query.filter_by(report_id=report.report_id).first()

    payload = {
        "report_id": report.report_id,
        "crop_type": report.crop_type,
        "description": report.description,
        "image_path": report.image_path,
        "status": report.status,
        "district": report.district,
        "submitted_at": report.submitted_at.isoformat(),
        "ml_diagnosis": None,
        "feedback": None,
    }

    if ml:
        payload["ml_diagnosis"] = {
            "predicted_disease": ml.predicted_disease,
            "confidence_score": float(ml.confidence_score or 0),
            "top3_predictions": ml.top3_predictions,
            "model_version": ml.model_version,
        }

    if feedback:
        payload["feedback"] = {
            "verified_disease": feedback.verified_disease,
            "treatment_advice": feedback.treatment_advice,
            "severity_level": feedback.severity_level,
            "ml_agreement": feedback.ml_agreement,
        }

    return jsonify({"success": True, "data": payload}), 200


@reports_bp.post("/<int:report_id>/feedback")
@jwt_required()
def submit_feedback(report_id: int):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "agronomist":
        return jsonify({"success": False, "message": "Only agronomists can submit feedback"}), 403

    report = CropReport.query.get_or_404(report_id)

    data = request.get_json() or {}
    errors = feedback_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    feedback = AgronomistFeedback.query.filter_by(report_id=report.report_id).first()
    if not feedback:
        feedback = AgronomistFeedback(report_id=report.report_id, agronomist_id=user.user_id)
        db.session.add(feedback)

    feedback.verified_disease = data.get("verified_disease")
    feedback.treatment_advice = data["treatment_advice"]
    feedback.severity_level = data.get("severity_level", "medium")
    feedback.ml_agreement = data.get("ml_agreement")

    report.status = "reviewed"
    db.session.commit()

    return jsonify({"success": True, "message": "Feedback saved"}), 200

