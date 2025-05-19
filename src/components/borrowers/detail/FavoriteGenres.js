// src/components/borrowers/detail/FavoriteGenres.jsx
import React from 'react';

function FavoriteGenres({ genres = [] }) {
  // If no genres, don't render the component
  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <div className="favorite-genres-card">
      <div className="favorite-genres-header">
        <h2>Favorittsjangere</h2>
      </div>
      <div className="favorite-genres-content">
        <div className="genres-list">
          {genres.map((genre, index) => (
            <div key={index} className="genre-info">
              <span className="genre-name">{genre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavoriteGenres;