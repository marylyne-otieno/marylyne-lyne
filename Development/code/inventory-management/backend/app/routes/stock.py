from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from ..extensions import db
from ..models import StockTransaction, Product


stock_bp = Blueprint("stock", __name__)




@stock_bp.route("/add", methods=["POST"])
@jwt_required()
def add_stock():

    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity")
    reason = data.get("reason")

    if not product_id or not quantity:
        return jsonify({
            "message": "Product and quantity are required"
        }), 400

    if quantity <= 0:
        return jsonify({
            "message": "Quantity must be greater than 0"
        }), 400

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404

    product.quantity += quantity

    transaction = StockTransaction(
        product_id=product.id,
        transaction_type="ADD",
        quantity=quantity,
        reason=reason
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Stock added successfully",
        "product": {
            "id": product.id,
            "name": product.name,
            "quantity": product.quantity
        }
    }), 200



@stock_bp.route("/stock/out", methods=["POST"])
@jwt_required()
def stock_out():

    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or not quantity:
        return jsonify({
            "message": "Product ID and quantity are required"
        }), 400

    if quantity <= 0:
        return jsonify({
            "message": "Quantity must be greater than 0"
        }), 400

    product = Product.query.get_or_404(product_id)

    if product.quantity < quantity:
        return jsonify({
            "message": "Insufficient stock"
        }), 400

    product.quantity -= quantity

    transaction = StockTransaction(
        product_id=product.id,
        quantity=quantity,
        transaction_type="stock_out"
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Stock removed successfully",
        "current_quantity": product.quantity
    }), 200




@stock_bp.route("/stock/history", methods=["GET"])
@jwt_required()
def stock_history():

    transactions = StockTransaction.query.order_by(
        StockTransaction.created_at.desc()
    ).all()

    history = []

    for transaction in transactions:

        history.append({
            "id": transaction.id,
            "product_id": transaction.product_id,
            "product_name": transaction.product.name,
            "quantity": transaction.quantity,
            "transaction_type": transaction.transaction_type,
            "created_at": transaction.created_at.isoformat()
        })

    return jsonify({
        "message": "Stock history loaded successfully",
        "history": history
    }), 200





@stock_bp.route("/return", methods=["POST"])
@jwt_required()
def return_stock():

    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity")
    reason = data.get("reason")

    if not product_id or not quantity:
        return jsonify({
            "message": "Product and quantity are required"
        }), 400

    if quantity <= 0:
        return jsonify({
            "message": "Quantity must be greater than 0"
        }), 400

    product = Product.query.get(product_id)

    if not product:
        return jsonify({
            "message": "Product not found"
        }), 404

    product.quantity += quantity

    transaction = StockTransaction(
        product_id=product.id,
        transaction_type="RETURN",
        quantity=quantity,
        reason=reason
    )

    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Stock returned successfully",
        "product": {
            "id": product.id,
            "name": product.name,
            "quantity": product.quantity
        }
    }), 200