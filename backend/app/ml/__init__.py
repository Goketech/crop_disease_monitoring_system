from flask import Blueprint

ml_bp = Blueprint("ml", __name__)

from . import routes  # noqa: E402,F401

