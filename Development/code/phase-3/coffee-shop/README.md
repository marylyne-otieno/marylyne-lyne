# coffee-shop

 ☕ Coffee Shop Domain Modeling

## Overview

This project is a domain modeling exercise built using Object-Oriented Programming (OOP) principles in Python. It models the basic relationships within a coffee shop environment, including customers, coffee types, and orders.

The system uses classes to represent core entities (`Customer`, `Coffee`, and `Order`) and establishes their relationships using instance methods, properties, and validations.

---

# Project Structure

coffee_shop/
│
├── customer.py # Defines the Customer class
├── coffee.py # Defines the Coffee class
├── order.py # Defines the Order class
├── debug.py # Script for manually testing functionality
├── Pipfile # Pipenv environment config
├── Pipfile.lock # Dependency lock file
├── README.md # Project documentation
└── tests/
├── test_customer.py
├── test_coffee.py
└── test_order.py



---


Domain Model Summary
Entities:
Customer

Attributes: name

Methods: orders(), coffees(), create_order(), most_aficionado(coffee)

Coffee

Attributes: name

Methods: orders(), customers(), num_orders(), average_price()

Order

Attributes: customer, coffee, price

Relationships: Belongs to one Customer and one Coffee

Features
Establishes many-to-many relationships between Customer and Coffee through Order.

Includes validation for:

Customer names (string, 1–15 chars)

Coffee names (string, minimum 3 chars)

Order price (float between 1.0 and 10.0)














