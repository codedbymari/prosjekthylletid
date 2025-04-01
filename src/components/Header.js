// src/components/Header.js
import React from 'react';
import './Header.css';

function Header({ onMenuClick }) {
  return (
    <header className="app-header">
      <div className="left-panel">
        <div className="user-info">
          <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Toggle menu">
            <span className="menu-icon-bar"></span>
            <span className="menu-icon-bar"></span>
            <span className="menu-icon-bar"></span>
          </button>
          <div className="user-details">
            <span className="user-name">Therese Engan</span>
            <span className="user-id">Nordre Follo</span>
            <span className="user-id">Superbruker</span>
          </div>
        </div>
      </div>
      <div className="header-title">
        <h1></h1>
      </div>
    </header>
  );
}

export default Header;