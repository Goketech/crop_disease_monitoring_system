import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    load_dotenv()

    app = Flask(__name__)

    from .config import Config

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    from .auth.routes import auth_bp
    from .reports.routes import reports_bp
    from .ml.routes import ml_bp
    from .notify.routes import notify_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(ml_bp, url_prefix="/api/ml")
    app.register_blueprint(notify_bp, url_prefix="/api/notify")

    @app.get("/health")
    def health_check():
        return {"success": True, "message": "OK"}, 200

    return app


from . import models  # noqa: E402,F401  ensure models are registered

