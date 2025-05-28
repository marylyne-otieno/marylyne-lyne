
import pytest
from customer import Customer
from coffee import Coffee
from order import Order

def test_valid_customer_name():
    customer = Customer("Mary")
    assert customer.name == "Mary"

def test_invalid_customer_name_too_short():
    with pytest.raises(Exception):
        Customer("")

def test_invalid_customer_name_too_long():
    with pytest.raises(Exception):
        Customer("A very very long name")

def test_create_order():
    customer = Customer("Alice")
    coffee = Coffee("Latte")
    order = customer.create_order(coffee, 5.0)
    assert order in customer.orders()
    assert coffee in customer.coffees()

def test_most_aficionado():
    coffee = Coffee("Espresso")
    c1 = Customer("John")
    c2 = Customer("Jane")
    c1.create_order(coffee, 5.0)
    c1.create_order(coffee, 4.0)
    c2.create_order(coffee, 3.0)
    assert Customer.most_aficionado(coffee) == c1
