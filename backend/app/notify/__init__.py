from flask import Blueprint

notify_bp = Blueprint("notify", __name__)

from . import routes  # noqa: E402,F401

