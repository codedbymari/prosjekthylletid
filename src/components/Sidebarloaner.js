import React from 'react';
import './Sidebarloaner.css';

function Sidebar({ active }) {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li className={active === 'hjem' ? 'active' : ''}>
            <a href="#hjem">Hjem</a>
          </li>
          <li className={active === 'låner' ? 'active' : ''}>
            <a href="#låner">Lånere</a>
          </li>
          <li className={active === 'samlinger' ? 'active' : ''}>
            <a href="#samlinger">Samlinger</a>
          </li>
          <li className={active === 'reservering' ? 'active' : ''}>
            <a href="#reservering">Reservering</a>
          </li>
          <li className={active === 'innkjøp' ? 'active' : ''}>
            <a href="#innkjøp">Innkjøp</a>
          </li>
          <li className={active === 'fjernlån' ? 'active' : ''}>
            <a href="#fjernlån">Fjernlån</a>
          </li>
          <li className={active === 'arrangementer' ? 'active' : ''}>
            <a href="#arrangementer">Arrangementer</a>
          </li>
          <li className={active === 'statistikk' ? 'active' : ''}>
            <a href="#statistikk">Statistikk</a>
          </li>
          <li className={active === 'oppsett' ? 'active' : ''}>
            <a href="#oppsett">Oppsett</a>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <a href="#hjelp">Hjelp (F1)</a>
      </div>
    </div>
  );
}

export default Sidebar;