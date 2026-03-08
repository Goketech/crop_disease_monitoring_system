import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "sqlite:///crop_disease.db",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "False").lower() == "true"

    UPLOAD_FOLDER = os.path.abspath(
        os.getenv("UPLOAD_FOLDER", os.path.join(os.getcwd(), "uploads"))
    )
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH_MB", "5")) * 1024 * 1024

    AFRICASTALKING_API_KEY = os.getenv("AFRICASTALKING_API_KEY")
    AFRICASTALKING_USERNAME = os.getenv("AFRICASTALKING_USERNAME")

    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    EMAIL_SENDER = os.getenv("EMAIL_SENDER", "no-reply@example.com")

