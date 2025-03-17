// Header.jsx
import React from 'react';
import './Header.css'; // Importer CSS-filen

function Header() {
  return (
    <header className="app-header">
      {/* Left panel with user info */}
      <div className="left-panel">
        <div className="user-info">
          <div className="user-details">
            <span className="user-name">Therese Engan</span>
            <span className="user-id">Nordre Follo</span>
            <span className="user-id">Superbruker</span>

          </div>
        </div>
      </div>

      {/* Reservering title on the right */}
      <div className="header-title">
        <br></br>Lånere
      </div>
    </header>
  );
}

export default Header;
