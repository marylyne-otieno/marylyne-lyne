
from app import session
from app.models import Movie, Review, Viewer

def add_movie():
    title = input("Enter movie title: ")
    director = input("Enter director: ")
    genre = input("Enter genre: ")

    movie = Movie(title=title, director=director, genre=genre)
    session.add(movie)
    session.commit()
    print(f" Movie '{title}' added successfully.")

def view_movies():
    movies = session.query(Movie).all()
    if not movies:
        print("No movies found.")
    else:
        for movie in movies:
            print(f"🎬 {movie.id}. {movie.title} - {movie.director} [{movie.genre}]")

def delete_movie():
    view_movies()
    movie_id = input("Enter the ID of the movie to delete: ")
    movie = session.query(Movie).get(movie_id)
    if movie:
        session.delete(movie)
        session.commit()
        print(f" Movie '{movie.title}' deleted.")
    else:
        print("❌ Movie not found.")



def add_review():
    movies = session.query(Movie).all()
    if not movies:
        print("❌ No movies found. Please add a movie first.")
        return

    print("\n🎬 Available Movies:")
    for movie in movies:
        print(f"{movie.id}. {movie.title}")

    try:
        movie_id = int(input("Enter the Movie ID you want to review: "))
    except ValueError:
        print("❌ Invalid input. Please enter a number.")
        return

    movie = session.query(Movie).get(movie_id)
    if not movie:
        print("❌ Movie not found.")
        return

    comment = input("Write a comment ❤️: ")

    while True:
        rating_input = input("Give a rating (1–5): ")
        if rating_input.isdigit() and 1 <= int(rating_input) <= 5:
            rating = int(rating_input)
            break
        else:
            print(" Please enter a valid rating between 1 and 5.")

    review = Review(comment=comment, rating=rating, movie=movie)
    session.add(review)
    session.commit()

    print(" Review added successfully!")


def view_reviews():
    movies = session.query(Movie).all()
    if not movies:
        print("❌ No movies available.")
        return

    print("\n🎬 Available Movies:")
    for movie in movies:
        print(f"{movie.id}. {movie.title}")

    try:
        movie_id = int(input("Enter the Movie ID to view reviews: "))
    except ValueError:
        print("❌ Invalid input. Please enter a number.")
        return

    movie = session.query(Movie).get(movie_id)
    if not movie:
        print("❌ Movie not found.")
        return

    print(f"\n📄 Reviews for '{movie.title}':")
    if not movie.reviews:
        print("No reviews found.")
    else:
        for review in movie.reviews:
            print(f"⭐ {review.rating}/5 - {review.comment}")



def add_viewer():
    name = input("Enter viewer's name: ").strip()
    if not name:
        print("❌ Name can't be empty.")
        return

    viewer = Viewer(name=name)
    session.add(viewer)
    session.commit()
    print(f" Viewer '{name}' added.")

def view_viewers():
    viewers = session.query(Viewer).all()
    if not viewers:
        print("No viewers found.")
        return

    print("\n📋 List of Viewers:")
    for viewer in viewers:
        print(f"{viewer.id}. {viewer.name}")


