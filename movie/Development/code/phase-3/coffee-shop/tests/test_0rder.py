
import pytest
from customer import Customer
from coffee import Coffee
from order import Order

def test_valid_order():
    customer = Customer("Eve")
    coffee = Coffee("Americano")
    order = Order(customer, coffee, 5.5)
    assert order.customer == customer
    assert order.coffee == coffee
    assert order.price == 5.5

def test_invalid_price_too_low():
    customer = Customer("Liam")
    coffee = Coffee("Macchiato")
    with pytest.raises(ValueError):
        Order(customer, coffee, 0.5)

def test_invalid_price_too_high():
    customer = Customer("Liam")
    coffee = Coffee("Macchiato")
    with pytest.raises(ValueError):
        Order(customer, coffee, 15.0)

def test_invalid_customer_type():
    coffee = Coffee("Latte")
    with pytest.raises(TypeError):
        Order("NotACustomer", coffee, 5.0)

def test_invalid_coffee_type():
    customer = Customer("Maya")
    with pytest.raises(TypeError):
        Order(customer, "NotACoffee", 5.0)
