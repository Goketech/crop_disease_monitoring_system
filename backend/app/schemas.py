from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    phone_number = fields.Str(required=True, validate=validate.Length(max=20))
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))
    role = fields.Str(
        required=False, validate=validate.OneOf(["farmer", "agronomist", "admin"])
    )
    district = fields.Str(required=False, allow_none=True)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)


class UploadReportSchema(Schema):
    crop_type = fields.Str(required=True, validate=validate.Length(max=80))
    description = fields.Str(required=False, allow_none=True)
    district = fields.Str(required=True, validate=validate.Length(max=60))


class FeedbackSchema(Schema):
    verified_disease = fields.Str(required=False, allow_none=True)
    treatment_advice = fields.Str(required=True)
    severity_level = fields.Str(
        required=False,
        validate=validate.OneOf(["low", "medium", "high", "critical"]),
    )
    ml_agreement = fields.Bool(required=False, allow_none=True)


class SmsNotificationSchema(Schema):
    target_district = fields.Str(required=True)
    message_body = fields.Str(required=True, validate=validate.Length(max=160))


class EmailReportSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(max=200))
    body_html = fields.Str(required=True)
    target_district = fields.Str(required=False, allow_none=True)
    recipient_emails = fields.List(fields.Email(), required=False)

