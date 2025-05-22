import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './styles/Header.css';

const Header = ({ isSidebarCollapsed }) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');
  const [activeTab, setActiveTab] = useState('oversikt');

  const routeTitles = useMemo(() => ({
    '/': 'Hjem',
    '/laaner': 'Lånere',
    '/reservering': 'Reservering',
    '/reservering/aktive': 'Reservering',
    '/reservering/innstillinger': 'Reservering',
    '/statistikk': 'Statistikk',
    '/innkjøp': 'Innkjøp',
    '/samlinger': 'Samlinger',
    '/fjernlån': 'Fjernlån',
    '/arrangementer': 'Arrangementer',
    '/oppsett': 'Oppsett'
  }), []);

  const getTitleFromPath = (path) => {
    if (path.startsWith('/laaner/')) {
      return `Lånere`;
    }

    // Try to match full path first
    if (routeTitles[path]) return routeTitles[path];

    // Try to match base route
    const baseRoute = '/' + path.split('/')[1];
    return routeTitles[baseRoute] || 'Hjem';
  };

  useEffect(() => {
    const path = location.pathname;
    setPageTitle(getTitleFromPath(path));

    if (path.startsWith('/reservering')) {
      if (path.includes('/aktive')) {
        setActiveTab('aktive');
      } else if (path.includes('/innstillinger')) {
        setActiveTab('innstillinger');
      } else {
        setActiveTab('oversikt');
      }
    }
  }, [location, routeTitles]);

  const showReservationTabs = location.pathname.startsWith('/reservering');

  return (
    <header className={`app-header library-header ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-content">
        <div className="page-title-wrapper">
          <h1 className="page-title">{pageTitle}</h1>
        </div>
        <div className="header-actions">
          {/* Header actions go here */}
        </div>
      </div>

      {showReservationTabs && (
        <div className={`nav-tabs ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Link 
            to="/reservering" 
            className={`nav-tab ${activeTab === 'oversikt' ? 'active' : ''}`}
            onClick={() => setActiveTab('oversikt')}
          >
            Oversikt
          </Link>
          <Link 
            to="/reservering/aktive" 
            className={`nav-tab ${activeTab === 'aktive' ? 'active' : ''}`}
            onClick={() => setActiveTab('aktive')}
          >
            Aktive reserveringer
          </Link>
          <Link 
            to="/reservering/innstillinger" 
            className={`nav-tab ${activeTab === 'innstillinger' ? 'active' : ''}`}
            onClick={() => setActiveTab('innstillinger')}
          >
            Innstillinger
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
