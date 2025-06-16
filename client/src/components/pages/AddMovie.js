// client/src/pages/AddMovie.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useError } from '../../context/ErrorContext';
// import './AddMovie.css';

const AddMovie = () => {
  const [movie, setMovie] = useState({
    title: '',
    year: '',
    watched: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError } = useError();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMovie({
      ...movie,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/movies', movie);
      console.log("................... "+movie+" .................................");
      navigate('/movies');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorFields = Object.keys(error.response.data.errors || {}).join(', ');
        showError(`Please fix the following fields: ${errorFields}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Movie Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={movie.title}
            onChange={handleChange}
            required
            data-cy="movie-title-input"
          />
        </div>

        <div>
          <label>Release Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={movie.year}
            onChange={handleChange}
            required
            min="1888"
            max={new Date().getFullYear() + 5}
            data-cy="movie-year-input"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="watched"
              checked={movie.watched}
              onChange={handleChange}
              data-cy="movie-watched-checkbox"
            />
            I've watched this movie
          </label>
        </div>

        <div>
          <button
            type="button"
            className="btn-secondary"
            disabled={loading}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
