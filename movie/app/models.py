
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Viewer(Base):
    __tablename__ = 'viewers'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    reviews = relationship('Review', back_populates='viewer')

class Movie(Base):
    __tablename__ = 'movies'
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    director = Column(String)
    genre = Column(String)
    reviews = relationship('Review', back_populates='movie')

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    rating = Column(Float)
    comment = Column(String)
    movie_id = Column(Integer, ForeignKey('movies.id'))
    viewer_id = Column(Integer, ForeignKey('viewers.id'))

    movie = relationship('Movie', back_populates='reviews')
    viewer = relationship('Viewer', back_populates='reviews')
