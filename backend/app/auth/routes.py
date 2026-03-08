from datetime import datetime, timedelta
import hashlib

from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from passlib.hash import bcrypt

from .. import db
from ..models import Session, User
from ..schemas import LoginSchema, RegisterSchema
from . import auth_bp

register_schema = RegisterSchema()
login_schema = LoginSchema()


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    errors = register_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    if User.query.filter_by(email=data["email"]).first():
        return (
            jsonify({"success": False, "message": "Email already registered"}),
            400,
        )

    if User.query.filter_by(phone_number=data["phone_number"]).first():
        return (
            jsonify({"success": False, "message": "Phone already registered"}),
            400,
        )

    user = User(
        full_name=data["full_name"],
        email=data["email"],
        phone_number=data["phone_number"],
        password_hash=bcrypt.hash(data["password"]),
        role=data.get("role", "farmer"),
        district=data.get("district"),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "data": {"user_id": user.user_id}}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    errors = login_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not bcrypt.verify(data["password"], user.password_hash):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    additional_claims = {"role": user.role}
    access_token = create_access_token(identity=str(user.user_id), additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=str(user.user_id), additional_claims=additional_claims)

    token_hash = hashlib.sha256(access_token.encode("utf-8")).hexdigest()
    session = Session(
        user_id=user.user_id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + timedelta(hours=24),
    )
    db.session.add(session)
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "data": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": {
                        "id": user.user_id,
                        "full_name": user.full_name,
                        "role": user.role,
                        "district": user.district,
                    },
                },
            }
        ),
        200,
    )


@auth_bp.post("/logout")
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    token_hash = hashlib.sha256(jti.encode("utf-8")).hexdigest()
    session = Session.query.filter_by(token_hash=token_hash).first()
    if session:
        session.is_revoked = True
        db.session.commit()
    return jsonify({"success": True, "message": "Logged out"}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    return (
        jsonify(
            {
                "success": True,
                "data": {
                    "id": user.user_id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "role": user.role,
                    "district": user.district,
                },
            }
        ),
        200,
    )

