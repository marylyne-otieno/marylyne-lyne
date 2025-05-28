
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base

engine = create_engine('sqlite:///movie_watchlist.db')  
Session = sessionmaker(bind=engine)
session = Session()

def create_tables():
    Base.metadata.create_all(engine)
