// src/components/borrowers/detail/FavoriteAuthors.jsx
import React from 'react';

function FavoriteAuthors({ authors = [] }) {
  // If no authors, don't render the component
  if (!authors || authors.length === 0) {
    return null;
  }

  return (
    <div className="favorite-author-card">
      <div className="favorite-author-header">
        <h2>Favorittforfattere</h2>
      </div>
      <div className="favorite-author-content">
        <div className="authors-list">
          {authors.map((author, index) => (
            <div key={index} className="author-info">
              <span className="author-name">{author}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavoriteAuthors;