import React from 'react';
import './MovieList.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-card-content">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-year">{movie.year}</div>
        <div>
          <span>{movie.watched ? 'Watched' : 'Not Watched'}</span>
        </div>
      </div>
      <div className="movie-actions">
        <button className="action-btn edit">Edit</button>
        <button className="action-btn delete">Delete</button>
        {!movie.watched && <button className="action-btn mark-watched">Mark as Watched</button>}
      </div>
    </div>
  );
};

export default MovieCard;
