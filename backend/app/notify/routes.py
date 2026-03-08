from datetime import datetime

from flask import current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from .. import db
from ..models import EmailReport, SmsNotification, User
from ..schemas import EmailReportSchema, SmsNotificationSchema
from . import notify_bp

sms_schema = SmsNotificationSchema()
email_schema = EmailReportSchema()


@notify_bp.post("/sms")
@jwt_required()
def send_sms():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "agronomist":
        return jsonify({"success": False, "message": "Only agronomists can send SMS"}), 403

    data = request.get_json() or {}
    errors = sms_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    target_district = data["target_district"]
    message_body = data["message_body"]

    farmers = User.query.filter_by(role="farmer", district=target_district, is_active=True).all()
    recipients_count = len(farmers)

    api_response = {
        "provider": "africastalking",
        "mock": True,
        "message": "SMS queued in development mode",
    }

    sms = SmsNotification(
        sent_by=user.user_id,
        target_district=target_district,
        message_body=message_body,
        recipients_count=recipients_count,
        api_response=api_response,
        sent_at=datetime.utcnow(),
        delivery_status="pending",
    )
    db.session.add(sms)
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": "SMS queued (mocked)",
                "data": {"sms_id": sms.sms_id, "recipients_count": recipients_count},
            }
        ),
        202,
    )


@notify_bp.post("/email-report")
@jwt_required()
def send_email_report():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != "agronomist":
        return (
            jsonify({"success": False, "message": "Only agronomists can send reports"}),
            403,
        )

    data = request.get_json() or {}
    errors = email_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    sender = current_app.config.get("EMAIL_SENDER", "no-reply@example.com")

    report = EmailReport(
        agronomist_id=user.user_id,
        title=data["title"],
        body_html=data["body_html"],
        target_district=data.get("target_district"),
        recipient_emails=data.get("recipient_emails", []),
        sent_at=datetime.utcnow(),
        send_status="sent",
    )
    db.session.add(report)
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": "Email report recorded (mocked send)",
                "data": {"report_doc_id": report.report_doc_id, "sender": sender},
            }
        ),
        202,
    )

