import threading
import time
from datetime import datetime

from flask import jsonify
from flask_jwt_extended import jwt_required

from .. import db
from ..models import CropReport, MlDiagnosis
from . import ml_bp


def _run_dummy_inference(report_id: int):
    time.sleep(1.5)

    diagnosis = MlDiagnosis.query.filter_by(report_id=report_id).first()
    if not diagnosis:
        diagnosis = MlDiagnosis(report_id=report_id, model_version="v1.0-mobilenet-dummy")
        db.session.add(diagnosis)

    diagnosis.predicted_disease = "Sample Disease"
    diagnosis.confidence_score = 0.88
    diagnosis.top3_predictions = [
        {"label": "Sample Disease", "score": 0.88},
        {"label": "Another Disease", "score": 0.08},
        {"label": "Healthy", "score": 0.04},
    ]
    diagnosis.processing_time_ms = 1500
    diagnosis.diagnosed_at = datetime.utcnow()

    db.session.commit()


@ml_bp.get("/diagnose/<int:report_id>")
@jwt_required()
def trigger_diagnosis(report_id: int):
    report = CropReport.query.get_or_404(report_id)

    thread = threading.Thread(target=_run_dummy_inference, args=(report.report_id,))
    thread.daemon = True
    thread.start()

    return (
        jsonify(
            {
                "success": True,
                "message": "ML diagnosis started",
                "data": {"report_id": report.report_id},
            }
        ),
        202,
    )

