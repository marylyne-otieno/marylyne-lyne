from .extensions import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(120),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        default="staff"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def __repr__(self):
        return f"<User {self.email}>"


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    brand = db.Column(
        db.String(100),
        nullable=True
    )

    sku = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    barcode = db.Column(
        db.String(100),
        unique=True,
        nullable=True
    )

    image = db.Column(
    db.String(500),
    nullable=True
)

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=True
    )

    supplier_id = db.Column(
        db.Integer,
        db.ForeignKey("suppliers.id"),
        nullable=True
    )

    buying_price = db.Column(
        db.Float,
        nullable=False
    )

    selling_price = db.Column(
        db.Float,
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    minimum_stock = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    expiry_date = db.Column(
        db.Date,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


    category = db.relationship(
        "Category",
        back_populates="products"
    )

    supplier = db.relationship(
        "Supplier",
        back_populates="products"
    )

    sales = db.relationship(
        "Sale",
        back_populates="product",
        lazy=True
    )

    stock_transactions = db.relationship(
        "StockTransaction",
        back_populates="product",
        lazy=True
    )

    def __repr__(self):
        return f"<Product {self.name}>"


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )



    products = db.relationship(
        "Product",
        back_populates="category",
        lazy=True
    )

    def __repr__(self):
        return f"<Category {self.name}>"


class Supplier(db.Model):
    __tablename__ = "suppliers"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(120),
        nullable=False
    )

    phone = db.Column(
        db.String(20),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True
    )

    address = db.Column(
        db.String(255)
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )



    products = db.relationship(
        "Product",
        back_populates="supplier",
        lazy=True
    )

    def __repr__(self):
        return f"<Supplier {self.name}>"


class Sale(db.Model):
    __tablename__ = "sales"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    selling_price = db.Column(
        db.Float,
        nullable=False
    )

    total_amount = db.Column(
        db.Float,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )



    product = db.relationship(
        "Product",
        back_populates="sales"
    )

    def __repr__(self):
        return f"<Sale {self.id}>"


class StockTransaction(db.Model):
    __tablename__ = "stock_transactions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    transaction_type = db.Column(
        db.String(50),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    reason = db.Column(
        db.String(255),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )



    product = db.relationship(
        "Product",
        back_populates="stock_transactions"
    )

    def __repr__(self):
        return f"<StockTransaction {self.transaction_type}>"