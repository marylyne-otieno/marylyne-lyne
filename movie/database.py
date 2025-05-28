
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Base class for models
Base = declarative_base()

# SQLite database connection
engine = create_engine('sqlite:///movie_watchlist.db', echo=True)

# Session factory
Session = sessionmaker(bind=engine)
