
import pytest
from customer import Customer
from coffee import Coffee
from order import Order

def test_valid_coffee_name():
    coffee = Coffee("Latte")
    assert coffee.name == "Latte"

def test_invalid_coffee_name_too_short():
    with pytest.raises(Exception):
        Coffee("Es")

def test_orders_and_customers():
    coffee = Coffee("Mocha")
    customer1 = Customer("Alex")
    customer2 = Customer("Sam")
    order1 = Order(customer1, coffee, 4.5)
    order2 = Order(customer2, coffee, 6.0)

    assert order1 in coffee.orders()
    assert order2 in coffee.orders()
    assert customer1 in coffee.customers()
    assert customer2 in coffee.customers()

def test_num_orders_and_average_price():
    coffee = Coffee("Cappuccino")
    c1 = Customer("Tom")
    c2 = Customer("Jerry")
    Order(c1, coffee, 3.0)
    Order(c2, coffee, 6.0)

    assert coffee.num_orders() == 2
    assert coffee.average_price() == 4.5
