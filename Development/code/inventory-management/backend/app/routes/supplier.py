from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Supplier

supplier_bp = Blueprint("suppliers", __name__)



@supplier_bp.route("/", methods=["POST"])
@jwt_required()
def create_supplier():

    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    address = data.get("address")

    if not name or not phone:
        return jsonify({
            "message": "Supplier name and phone are required"
        }), 400

    existing_supplier = Supplier.query.filter_by(name=name).first()

    if existing_supplier:
        return jsonify({
            "message": "Supplier already exists"
        }), 409

    supplier = Supplier(
        name=name,
        phone=phone,
        email=email,
        address=address
    )

    db.session.add(supplier)
    db.session.commit()

    return jsonify({
        "message": "Supplier created successfully",
        "supplier": {
            "id": supplier.id,
            "name": supplier.name,
            "phone": supplier.phone,
            "email": supplier.email,
            "address": supplier.address,
            "created_at": supplier.created_at.isoformat()
        }
    }), 201



@supplier_bp.route("/", methods=["GET"])
@jwt_required()
def get_suppliers():

    suppliers = Supplier.query.all()

    result = []

    for supplier in suppliers:
        result.append({
            "id": supplier.id,
            "name": supplier.name,
            "phone": supplier.phone,
            "email": supplier.email,
            "address": supplier.address,
            "created_at": supplier.created_at.isoformat()
        })

    return jsonify({
        "suppliers": result
    }), 200


@supplier_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_supplier(id):

    supplier = Supplier.query.get_or_404(id)

    return jsonify({
        "supplier": {
            "id": supplier.id,
            "name": supplier.name,
            "phone": supplier.phone,
            "email": supplier.email,
            "address": supplier.address,
            "created_at": supplier.created_at.isoformat()
        }
    }), 200



@supplier_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_supplier(id):

    supplier = Supplier.query.get_or_404(id)

    data = request.get_json()

    supplier.name = data.get("name", supplier.name)
    supplier.phone = data.get("phone", supplier.phone)
    supplier.email = data.get("email", supplier.email)
    supplier.address = data.get("address", supplier.address)

    db.session.commit()

    return jsonify({
        "message": "Supplier updated successfully",
        "supplier": {
            "id": supplier.id,
            "name": supplier.name,
            "phone": supplier.phone,
            "email": supplier.email,
            "address": supplier.address
        }
    }), 200



@supplier_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_supplier(id):

    supplier = Supplier.query.get_or_404(id)

    db.session.delete(supplier)
    db.session.commit()

    return jsonify({
        "message": "Supplier deleted successfully"
    }), 200



@supplier_bp.route("/search", methods=["GET"])
@jwt_required()
def search_suppliers():

    keyword = request.args.get("q")

    if not keyword:
        return jsonify({
            "message": "Search keyword is required"
        }), 400

    suppliers = Supplier.query.filter(
        Supplier.name.ilike(f"%{keyword}%")
    ).all()

    result = []

    for supplier in suppliers:
        result.append({
            "id": supplier.id,
            "name": supplier.name,
            "phone": supplier.phone,
            "email": supplier.email,
            "address": supplier.address
        })

    return jsonify({
        "suppliers": result
    }), 200