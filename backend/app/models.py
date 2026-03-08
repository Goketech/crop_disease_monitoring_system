from datetime import datetime

from . import db


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(
        db.Enum("farmer", "agronomist", "admin", name="user_roles"),
        nullable=False,
        default="farmer",
    )
    district = db.Column(db.String(60), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    crop_reports = db.relationship("CropReport", back_populates="farmer", lazy=True)
    feedback = db.relationship(
        "AgronomistFeedback",
        back_populates="agronomist",
        lazy=True,
        foreign_keys="AgronomistFeedback.agronomist_id",
    )
    email_reports = db.relationship(
        "EmailReport",
        back_populates="agronomist",
        lazy=True,
        foreign_keys="EmailReport.agronomist_id",
    )
    sms_notifications = db.relationship(
        "SmsNotification",
        back_populates="sender",
        lazy=True,
        foreign_keys="SmsNotification.sent_by",
    )
    sessions = db.relationship("Session", back_populates="user", lazy=True)


class CropReport(db.Model):
    __tablename__ = "crop_reports"

    report_id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id"), nullable=False, index=True
    )
    crop_type = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(300), nullable=False)
    status = db.Column(
        db.Enum("pending", "reviewed", "resolved", name="report_status"),
        default="pending",
    )
    district = db.Column(db.String(60), nullable=False, index=True)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    farmer = db.relationship("User", back_populates="crop_reports")
    ml_diagnosis = db.relationship(
        "MlDiagnosis",
        back_populates="report",
        uselist=False,
    )
    feedback = db.relationship(
        "AgronomistFeedback",
        back_populates="report",
        uselist=False,
    )


class MlDiagnosis(db.Model):
    __tablename__ = "ml_diagnoses"

    diagnosis_id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(
        db.Integer,
        db.ForeignKey("crop_reports.report_id"),
        nullable=False,
        unique=True,
    )
    predicted_disease = db.Column(db.String(120), nullable=True)
    confidence_score = db.Column(db.Numeric(5, 4), nullable=True)
    top3_predictions = db.Column(db.JSON, nullable=True)
    model_version = db.Column(db.String(40), nullable=False)
    processing_time_ms = db.Column(db.Integer, nullable=True)
    diagnosed_at = db.Column(db.DateTime, default=datetime.utcnow)

    report = db.relationship("CropReport", back_populates="ml_diagnosis")


class AgronomistFeedback(db.Model):
    __tablename__ = "agronomist_feedback"

    feedback_id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(
        db.Integer, db.ForeignKey("crop_reports.report_id"), nullable=False, unique=True
    )
    agronomist_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id"), nullable=False
    )
    verified_disease = db.Column(db.String(120), nullable=True)
    treatment_advice = db.Column(db.Text, nullable=False)
    severity_level = db.Column(
        db.Enum("low", "medium", "high", "critical", name="severity_levels"),
        default="medium",
    )
    ml_agreement = db.Column(db.Boolean, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    report = db.relationship("CropReport", back_populates="feedback")
    agronomist = db.relationship("User", back_populates="feedback")


class EmailReport(db.Model):
    __tablename__ = "reports"

    report_doc_id = db.Column(db.Integer, primary_key=True)
    agronomist_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id"), nullable=False
    )
    title = db.Column(db.String(200), nullable=False)
    body_html = db.Column(db.Text, nullable=False)
    target_district = db.Column(db.String(60), nullable=True)
    recipient_emails = db.Column(db.JSON, nullable=True)
    sent_at = db.Column(db.DateTime, nullable=True)
    send_status = db.Column(
        db.Enum("draft", "sent", "failed", name="email_send_status"),
        default="draft",
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    agronomist = db.relationship("User", back_populates="email_reports")


class SmsNotification(db.Model):
    __tablename__ = "sms_notifications"

    sms_id = db.Column(db.Integer, primary_key=True)
    sent_by = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    target_district = db.Column(db.String(60), nullable=False)
    message_body = db.Column(db.String(160), nullable=False)
    recipients_count = db.Column(db.Integer, nullable=False)
    api_response = db.Column(db.JSON, nullable=True)
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)
    delivery_status = db.Column(
        db.Enum("pending", "delivered", "partial", "failed", name="delivery_status"),
        default="pending",
    )

    sender = db.relationship("User", back_populates="sms_notifications")


class Session(db.Model):
    __tablename__ = "sessions"

    session_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    token_hash = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_revoked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="sessions")

