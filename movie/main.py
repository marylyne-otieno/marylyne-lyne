
from app.cli import add_movie, view_movies, delete_movie, add_review, view_reviews, add_viewer, view_viewers

def main():
    while True:
        print(" Movie Watchlist CLI")
        print("1. Add Movie")
        print("2. View All Movies")
        print("3. Delete a Movie")
        print("4. Exit")

        choice = input("Choose an option: ")

        if choice == '1':
            add_movie()
        elif choice == '2':
            view_movies()
        elif choice == '3':
            delete_movie()
        elif choice == '4':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid option.")
if __name__ == '__main__':
    main()

def main():
    while True:
        print("\n🎬 Movie CLI Menu")
        print("1. Add a Review")
        print("2. View Reviews for a Movie")
        print("3. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            add_review()
        elif choice == "2":
            view_reviews()
        elif choice == "3":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid option. Please try again.")


if __name__ == '__main__':
    main()



def main():
    while True:
        print("\n🎬 Movie CLI Menu")
        print("1. Add a Review")
        print("2. View Reviews for a Movie")
        print("3. Add a Viewer")
        print("4. View All Viewers")
        print("5. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            add_review()
        elif choice == "2":
            view_reviews()
        elif choice == "3":
            add_viewer()
        elif choice == "4":
            view_viewers()
        elif choice == "5":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid option. Try again.")



if __name__ == '__main__':
    main()

