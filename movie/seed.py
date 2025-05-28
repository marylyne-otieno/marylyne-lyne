
from database import Session, engine, Base
from app.models import Movie

# Create tables if they don't exist
Base.metadata.create_all(engine)

session = Session()

def seed_movies():
    if session.query(Movie).first():
        print(" Movies already seeded.")
        return

    movies = [
        Movie(title="Inception"),
        Movie(title="The Matrix"),
        Movie(title="Black Panther"),
        Movie(title="Interstellar"),
        Movie(title="Everything Everywhere All At Once")
    ]

    session.add_all(movies)
    session.commit()
    print("✅ Seeded movie data.")

if __name__ == "__main__":
    seed_movies()
