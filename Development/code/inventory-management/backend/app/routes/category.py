from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import Category

category_bp = Blueprint("category", __name__)


@category_bp.route("/categories", methods=["POST"])
@jwt_required()
def create_category():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({
            "message": "Category name is required"
        }), 400

    existing_category = Category.query.filter_by(name=name).first()

    if existing_category:
        return jsonify({
            "message": "Category already exists"
        }), 409

    new_category = Category(
        name=name,
        description=description
    )

    db.session.add(new_category)
    db.session.commit()

    return jsonify({
        "message": "Category created successfully",
        "category": {
            "id": new_category.id,
            "name": new_category.name,
            "description": new_category.description,
            "created_at": new_category.created_at.isoformat()
        }
    }), 201



@category_bp.route("/categories", methods=["GET"])
@jwt_required()
def get_categories():

    categories = Category.query.all()

    result = []

    for category in categories:
        result.append({
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "created_at": category.created_at.isoformat()
        })

    return jsonify({
        "categories": result
    }), 200


@category_bp.route("/categories/<int:category_id>", methods=["GET"])
@jwt_required()
def get_category(category_id):

    category = Category.query.get_or_404(category_id)

    return jsonify({
        "category": {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "created_at": category.created_at.isoformat()
        }
    }), 200



@category_bp.route("/categories/<int:category_id>", methods=["PUT"])
@jwt_required()
def update_category(category_id):

    category = Category.query.get_or_404(category_id)

    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if name:
        existing_category = Category.query.filter(
            Category.name == name,
            Category.id != category_id
        ).first()

        if existing_category:
            return jsonify({
                "message": "Category name already exists"
            }), 409

        category.name = name

    if description is not None:
        category.description = description

    db.session.commit()

    return jsonify({
        "message": "Category updated successfully",
        "category": {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "created_at": category.created_at.isoformat()
        }
    }), 200



@category_bp.route("/categories/<int:category_id>", methods=["DELETE"])
@jwt_required()
def delete_category(category_id):

    category = Category.query.get_or_404(category_id)

    db.session.delete(category)
    db.session.commit()

    return jsonify({
        "message": "Category deleted successfully"
    }), 200