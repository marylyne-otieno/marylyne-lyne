from flask import Blueprint, request, jsonify

from flask_jwt_extended import jwt_required

from sqlalchemy import or_

from ..extensions import db
from ..models import Product, Category


product_bp = Blueprint("products", __name__)


def product_to_dict(product):
    return {
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

        "image": product.image,

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
    }



@product_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400

    name = data.get("name")
    brand = data.get("brand")
    sku = data.get("sku")
    barcode = data.get("barcode")

    buying_price = data.get("buying_price")
    selling_price = data.get("selling_price")

    quantity = data.get("quantity", 0)
    minimum_stock = data.get("minimum_stock", 5)

    category_id = data.get("category_id")
    expiry_date = data.get("expiry_date")

    image = data.get("image")

    if not name or not sku:
        return jsonify({
            "message": "Name and SKU are required"
        }), 400

    if buying_price is None or selling_price is None:
        return jsonify({
            "message": "Buying price and selling price are required"
        }), 400



    if category_id:
        category = Category.query.get(category_id)

        if not category:
            return jsonify({
                "message": "Category not found"
            }), 404


    existing_sku = Product.query.filter_by(
        sku=sku
    ).first()

    if existing_sku:
        return jsonify({
            "message": "A product with this SKU already exists"
        }), 409



    if barcode:

        existing_barcode = Product.query.filter_by(
            barcode=barcode
        ).first()

        if existing_barcode:
            return jsonify({
                "message": "A product with this barcode already exists"
            }), 409



    from datetime import datetime

    parsed_expiry_date = None

    if expiry_date:

        try:

            parsed_expiry_date = datetime.strptime(
                expiry_date,
                "%Y-%m-%d"
            ).date()

        except ValueError:

            return jsonify({
                "message": "Expiry date must be in YYYY-MM-DD format"
            }), 400



    product = Product(
        name=name,
        brand=brand,
        sku=sku,
        barcode=barcode,

        buying_price=float(buying_price),
        selling_price=float(selling_price),

        quantity=int(quantity),
        minimum_stock=int(minimum_stock),

        category_id=category_id,

        expiry_date=parsed_expiry_date,

        image=image
    )

    db.session.add(product)

    db.session.commit()

    return jsonify({
        "message": "Product created successfully",
        "product": product_to_dict(product)
    }), 201


@product_bp.route("/", methods=["GET"])
@jwt_required()
def get_products():

    products = Product.query.order_by(
        Product.created_at.desc()
    ).all()

    result = []

    for product in products:
        result.append(
            product_to_dict(product)
        )

    return jsonify({
        "products": result
    }), 200



@product_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_product(id):

    product = Product.query.get_or_404(id)

    return jsonify(
        product_to_dict(product)
    ), 200


@product_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):

    product = Product.query.get_or_404(id)

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400


    product.name = data.get(
        "name",
        product.name
    )

    product.brand = data.get(
        "brand",
        product.brand
    )


    product.buying_price = float(
        data.get(
            "buying_price",
            product.buying_price
        )
    )

    product.selling_price = float(
        data.get(
            "selling_price",
            product.selling_price
        )
    )



    product.quantity = int(
        data.get(
            "quantity",
            product.quantity
        )
    )

    product.minimum_stock = int(
        data.get(
            "minimum_stock",
            product.minimum_stock
        )
    )



    new_sku = data.get("sku")

    if new_sku and new_sku != product.sku:

        existing_sku = Product.query.filter(
            Product.sku == new_sku,
            Product.id != product.id
        ).first()

        if existing_sku:

            return jsonify({
                "message": "A product with this SKU already exists"
            }), 409

        product.sku = new_sku



    new_barcode = data.get("barcode")

    if new_barcode != product.barcode:

        if new_barcode:

            existing_barcode = Product.query.filter(
                Product.barcode == new_barcode,
                Product.id != product.id
            ).first()

            if existing_barcode:

                return jsonify({
                    "message": "A product with this barcode already exists"
                }), 409

        product.barcode = new_barcode



    if "category_id" in data:

        category_id = data.get("category_id")

        if category_id:

            category = Category.query.get(
                category_id
            )

            if not category:

                return jsonify({
                    "message": "Category not found"
                }), 404

        product.category_id = category_id



    if "image" in data:

        product.image = data.get("image")



    if "expiry_date" in data:

        expiry_date = data.get("expiry_date")

        if expiry_date:

            from datetime import datetime

            try:

                product.expiry_date = datetime.strptime(
                    expiry_date,
                    "%Y-%m-%d"
                ).date()

            except ValueError:

                return jsonify({
                    "message": "Expiry date must be in YYYY-MM-DD format"
                }), 400

        else:

            product.expiry_date = None



    db.session.commit()

    return jsonify({
        "message": "Product updated successfully",
        "product": product_to_dict(product)
    }), 200




@product_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):

    product = Product.query.get_or_404(id)

    db.session.delete(product)

    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    }), 200




@product_bp.route("/search", methods=["GET"])
@jwt_required()
def search_products():

    keyword = request.args.get(
        "q",
        ""
    ).strip()

    if not keyword:

        return jsonify({
            "message": "Search keyword is required"
        }), 400

    products = Product.query.filter(
        or_(
            Product.name.ilike(
                f"%{keyword}%"
            ),

            Product.brand.ilike(
                f"%{keyword}%"
            ),

            Product.sku.ilike(
                f"%{keyword}%"
            ),

            Product.barcode.ilike(
                f"%{keyword}%"
            )
        )
    ).all()

    result = []

    for product in products:

        result.append(
            product_to_dict(product)
        )

    return jsonify({
        "products": result
    }), 200




@product_bp.route("/low-stock", methods=["GET"])
@jwt_required()
def low_stock_products():

    products = Product.query.filter(
        Product.quantity <= Product.minimum_stock
    ).all()

    result = []

    for product in products:

        result.append(
            product_to_dict(product)
        )

    return jsonify({
        "products": result
    }), 200

