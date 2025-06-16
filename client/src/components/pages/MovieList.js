import React from 'react';
import MovieCard from './MovieCard';
import './MovieList.css';

const MovieList = ({ movies = [] }) => {

    console.log("............"+movies+";;;;;;;;;;;;;;;;;;;;;;;;");
  return (
    <div className="movie-list">
      {movies.map(movie => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
};


export default MovieList;
