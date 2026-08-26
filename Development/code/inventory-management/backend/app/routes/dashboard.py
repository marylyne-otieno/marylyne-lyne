from flask import Blueprint, jsonify

from flask_jwt_extended import jwt_required

from ..models import Product, Category, Supplier


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def dashboard():



    total_products = Product.query.count()

    total_categories = Category.query.count()

    total_suppliers = Supplier.query.count()

    low_stock = Product.query.filter(
        Product.quantity <= Product.minimum_stock
    ).count()

    out_of_stock = Product.query.filter(
        Product.quantity == 0
    ).count()




    inventory_value = sum(
        product.buying_price * product.quantity
        for product in Product.query.all()
    )

    recent_products = Product.query.order_by(
        Product.created_at.desc()
    ).limit(5).all()

    recent_products_data = []

    for product in recent_products:

        recent_products_data.append({

            "id": product.id,

            "name": product.name,

            "brand": product.brand,

            "sku": product.sku,

            "barcode": product.barcode,

            "category_id": product.category_id,

            "category": (
                product.category.name
                if product.category
                else None
            ),

            "buying_price": product.buying_price,

            "selling_price": product.selling_price,

            "quantity": product.quantity,

            "minimum_stock": product.minimum_stock,

            "expiry_date": (
                product.expiry_date.isoformat()
                if product.expiry_date
                else None
            ),

            "created_at": (
                product.created_at.isoformat()
                if product.created_at
                else None
            ),

            "updated_at": (
                product.updated_at.isoformat()
                if product.updated_at
                else None
            )

        })




    return jsonify({

        "total_products": total_products,

        "total_categories": total_categories,

        "total_suppliers": total_suppliers,

        "low_stock": low_stock,

        "out_of_stock": out_of_stock,

        "inventory_value": inventory_value,

        "recent_products": recent_products_data

    }), 200