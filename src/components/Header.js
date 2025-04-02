import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');
  const [activeTab, setActiveTab] = useState('RAPPORT');
  
  // Map routes to their corresponding titles
  const routeTitles = {
    '/': 'Hjem',
    '/låner': 'Låner',
    '/reservering': 'Reservering',
    '/statistikk': 'Statistikk',
    '/innkjøp': 'Innkjøp',
    '/samlinger': 'Samlinger',
    '/fjernlån': 'Fjernlån',
    '/arrangementer': 'Arrangementer',
    '/oppsett': 'Oppsett'
  };
  
  // Update the page title based on the current route
  useEffect(() => {
    const path = location.pathname;
    
    // Handle borrower detail pages
    if (path.startsWith('/låner/')) {
      const borrowerId = path.split('/').pop();
      setPageTitle(`Låner: ${borrowerId}`);
    } else {
      // Use the mapped title or default to the first part of the path
      const baseRoute = '/' + path.split('/')[1];
      setPageTitle(routeTitles[baseRoute] || 'Biblioteksystem');
    }
  }, [location]);

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="page-title-container">
            <h1 className="page-title">{pageTitle}</h1>
          </div>
          <div className="header-actions">
          </div>
        </div>
      </header>
      
      
      
    </>
  );
};

export default Header;