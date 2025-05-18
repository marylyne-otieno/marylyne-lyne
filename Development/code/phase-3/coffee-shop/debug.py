
from customer import Customer
from coffee import Coffee
from order import Order

alice = Customer("Alice")
bob = Customer("Bob")


latte = Coffee("Latte")
espresso = Coffee("Espresso")


o1 = Order(alice, latte, 4.5)
o2 = Order(alice, espresso, 3.0)
o3 = Order(bob, latte, 5.0)
o4 = Order(bob, latte, 4.0)


print("Alice's Coffees:", [c.name for c in alice.coffees()])
print("Latte Orders:", latte.num_orders())
print("Latte Average Price:", latte.average_price())
print("Most Aficionado for Latte:", Customer.most_aficionado(latte).name)
