import { useState, useEffect } from 'react';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(setMovies)
      .catch(console.error);
  }, []);
  return (
    <div>
      <h2>My Movie Watchlist</h2>
      <ul>
        {movies.map(m => <li key={m.id}>{m.title}</li>)}
      </ul>
    </div>
  );
}
