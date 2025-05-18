# coffee-shop

 ☕ Coffee Shop Domain Modeling

## Overview

This project is a domain modeling exercise built using Object-Oriented Programming (OOP) principles in Python. It models the basic relationships within a coffee shop environment, including customers, coffee types, and orders.

The system uses classes to represent core entities (`Customer`, `Coffee`, and `Order`) and establishes their relationships using instance methods, properties, and validations.

---

## 📁 Project Structure

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

yaml
Copy
Edit

---

## 🔧 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/coffee_shop.git
   cd coffee_shop
Set up the virtual environment using pipenv:

bash
Copy
Edit
pipenv install
pipenv shell
Install dependencies:

bash
Copy
Edit
pipenv install pytest
🧠 Domain Model Summary
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

✅ Features
Establishes many-to-many relationships between Customer and Coffee through Order.

Includes validation for:

Customer names (string, 1–15 chars)

Coffee names (string, minimum 3 chars)

Order price (float between 1.0 and 10.0)

Calculates:

Total number of orders for a coffee

Average price per coffee

The top customer for a given coffee

Includes unit tests using pytest

Designed following clean code and PEP 8 guidelines

🧪 Running Tests
To run the test suite:

bash
Copy
Edit
pytest
All core functionalities and edge cases are covered across:

test_customer.py

test_coffee.py

test_order.py

🐞 Debugging
A debug.py script is provided to interactively test the model:

bash
Copy
Edit
pipenv run python debug.py
Use this script to manually create customers, coffees, and orders, and observe relationships and method outputs.

❗ Validation & Error Handling
The application raises descriptive exceptions for:

Invalid name types or lengths

Invalid price ranges

Invalid data types for associations

💡 Key Concepts Demonstrated
Object-Oriented Design

Class relationships (one-to-many, many-to-many)

Input validation and exception handling

Aggregation and association methods

Unit testing using pytest

Clean and maintainable code structure












