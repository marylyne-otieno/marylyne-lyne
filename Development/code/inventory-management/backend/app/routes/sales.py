from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, date, timedelta

from ..extensions import db
from ..models import Product, Sale


sales_bp = Blueprint("sales", __name__)



@sales_bp.route("/", methods=["POST"])
@jwt_required()
def create_sale():

    data = request.get_json()

    print("Incoming Sale Data:", data)

    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or not quantity:
        return jsonify({
            "message": "Product ID and quantity are required"
        }), 400

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({
            "message": "Quantity must be a valid number"
        }), 400

    if quantity <= 0:
        return jsonify({
            "message": "Quantity must be greater than zero"
        }), 400

    product = Product.query.get_or_404(product_id)

    if product.quantity < quantity:
        return jsonify({
            "message": "Insufficient stock"
        }), 400

    product.quantity -= quantity

    total_amount = quantity * product.selling_price

    sale = Sale(
        product_id=product.id,
        quantity=quantity,
        selling_price=product.selling_price,
        total_amount=total_amount
    )

    db.session.add(sale)
    db.session.commit()

    return jsonify({
        "message": "Sale recorded successfully",
        "sale": {
            "id": sale.id,
            "product": product.name,
            "quantity": sale.quantity,
            "selling_price": sale.selling_price,
            "total_amount": sale.total_amount,
            "remaining_stock": product.quantity,
            "created_at": sale.created_at.isoformat()
        }
    }), 201



@sales_bp.route("/", methods=["GET"])
@jwt_required()
def get_sales():

    sales = Sale.query.order_by(
        Sale.created_at.desc()
    ).all()

    result = []

    for sale in sales:
        result.append({
            "id": sale.id,
            "product": sale.product.name,
            "quantity": sale.quantity,
            "selling_price": sale.selling_price,
            "total_amount": sale.total_amount,
            "created_at": sale.created_at.isoformat()
        })

    return jsonify({
        "sales": result
    }), 200



@sales_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_sale(id):

    sale = Sale.query.get_or_404(id)

    return jsonify({
        "id": sale.id,
        "product": sale.product.name,
        "quantity": sale.quantity,
        "selling_price": sale.selling_price,
        "total_amount": sale.total_amount,
        "created_at": sale.created_at.isoformat()
    }), 200



@sales_bp.route("/today", methods=["GET"])
@jwt_required()
def get_today_sales():

    today = date.today()

    sales = Sale.query.filter(
        db.func.date(Sale.created_at) == today
    ).order_by(
        Sale.created_at.desc()
    ).all()

    total_revenue = sum(
        sale.total_amount for sale in sales
    )

    total_products_sold = sum(
        sale.quantity for sale in sales
    )

    result = []

    for sale in sales:
        result.append({
            "id": sale.id,
            "product": sale.product.name,
            "quantity": sale.quantity,
            "selling_price": sale.selling_price,
            "total_amount": sale.total_amount,
            "created_at": sale.created_at.isoformat()
        })

    return jsonify({
        "period": "today",
        "total_revenue": total_revenue,
        "total_products_sold": total_products_sold,
        "total_transactions": len(sales),
        "sales": result
    }), 200



@sales_bp.route("/week", methods=["GET"])
@jwt_required()
def get_weekly_sales():

    today = date.today()

    week_start = today - timedelta(days=6)

    sales = Sale.query.filter(
        db.func.date(Sale.created_at) >= week_start,
        db.func.date(Sale.created_at) <= today
    ).order_by(
        Sale.created_at.desc()
    ).all()

    total_revenue = sum(
        sale.total_amount for sale in sales
    )

    total_products_sold = sum(
        sale.quantity for sale in sales
    )

    result = []

    for sale in sales:
        result.append({
            "id": sale.id,
            "product": sale.product.name,
            "quantity": sale.quantity,
            "selling_price": sale.selling_price,
            "total_amount": sale.total_amount,
            "created_at": sale.created_at.isoformat()
        })

    return jsonify({
        "period": "weekly",
        "start_date": week_start.isoformat(),
        "end_date": today.isoformat(),
        "total_revenue": total_revenue,
        "total_products_sold": total_products_sold,
        "total_transactions": len(sales),
        "sales": result
    }), 200



@sales_bp.route("/month", methods=["GET"])
@jwt_required()
def get_monthly_sales():

    today = date.today()

    month_start = today.replace(day=1)

    sales = Sale.query.filter(
        db.func.date(Sale.created_at) >= month_start,
        db.func.date(Sale.created_at) <= today
    ).order_by(
        Sale.created_at.desc()
    ).all()

    total_revenue = sum(
        sale.total_amount for sale in sales
    )

    total_products_sold = sum(
        sale.quantity for sale in sales
    )

    result = []

    for sale in sales:
        result.append({
            "id": sale.id,
            "product": sale.product.name,
            "quantity": sale.quantity,
            "selling_price": sale.selling_price,
            "total_amount": sale.total_amount,
            "created_at": sale.created_at.isoformat()
        })

    return jsonify({
        "period": "monthly",
        "start_date": month_start.isoformat(),
        "end_date": today.isoformat(),
        "total_revenue": total_revenue,
        "total_products_sold": total_products_sold,
        "total_transactions": len(sales),
        "sales": result
    }), 200



@sales_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_sale(id):

    sale = Sale.query.get_or_404(id)

    product = sale.product
    product.quantity += sale.quantity

    db.session.delete(sale)
    db.session.commit()

    return jsonify({
        "message": "Sale deleted successfully"
    }), 200



@sales_bp.route("/range", methods=["GET"])
@jwt_required()
def get_sales_by_range():

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not start_date or not end_date:
        return jsonify({
            "message": "Start date and end date are required"
        }), 400

    try:
        start = datetime.strptime(
            start_date,
            "%Y-%m-%d"
        ).date()

        end = datetime.strptime(
            end_date,
            "%Y-%m-%d"
        ).date()

    except ValueError:
        return jsonify({
            "message": "Invalid date format. Use YYYY-MM-DD"
        }), 400

    if start > end:
        return jsonify({
            "message": "Start date cannot be after end date"
        }), 400

    sales = Sale.query.filter(
        db.func.date(Sale.created_at) >= start,
        db.func.date(Sale.created_at) <= end
    ).order_by(
        Sale.created_at.desc()
    ).all()

    total_revenue = sum(
        sale.total_amount for sale in sales
    )

    total_products_sold = sum(
        sale.quantity for sale in sales
    )

    result = []

    for sale in sales:
        result.append({
            "id": sale.id,
            "product": sale.product.name,
            "quantity": sale.quantity,
            "selling_price": sale.selling_price,
            "total_amount": sale.total_amount,
            "created_at": sale.created_at.isoformat()
        })

    return jsonify({
        "start_date": start_date,
        "end_date": end_date,
        "total_revenue": total_revenue,
        "total_products_sold": total_products_sold,
        "total_transactions": len(sales),
        "sales": result
    }), 200






@sales_bp.route("/best-selling", methods=["GET"])
@jwt_required()
def best_selling_products():

    results = db.session.query(
        Product.id,
        Product.name,
        db.func.sum(Sale.quantity).label("units_sold"),
        db.func.sum(Sale.total_amount).label("revenue")
    ).join(
        Sale,
        Sale.product_id == Product.id
    ).group_by(
        Product.id,
        Product.name
    ).order_by(
        db.func.sum(Sale.quantity).desc()
    ).limit(10).all()

    products = []

    for product in results:

        products.append({
            "product_id": product.id,
            "product_name": product.name,
            "units_sold": int(product.units_sold or 0),
            "revenue": float(product.revenue or 0)
        })

    return jsonify({
        "message": "Best-selling products loaded successfully",
        "products": products
    }), 200




@sales_bp.route("/profit", methods=["GET"])
@jwt_required()
def profit_tracking():

    sales = Sale.query.all()

    total_revenue = 0
    total_cost = 0
    total_profit = 0

    for sale in sales:

        revenue = sale.selling_price * sale.quantity

        cost = sale.product.buying_price * sale.quantity

        profit = revenue - cost

        total_revenue += revenue
        total_cost += cost
        total_profit += profit

    return jsonify({
        "message": "Profit tracking loaded successfully",
        "total_revenue": total_revenue,
        "total_cost": total_cost,
        "total_profit": total_profit
    }), 200