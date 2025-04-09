import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="welcome-container">
          <div className="welcome-section">
            <div className="welcome-header">
              <div className="project-badge">DATA3710 Praktisk IT-prosjekt</div>
              <h1>Prosjekt <span className="highlight">Hylletid</span></h1>
              <p className="subtitle">En innovativ løsning for Nordre Follo Bibliotek</p>
            </div>
            
            <div className="project-description">
              <div className="description-with-icon">
                <div className="icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <p>
                  Prosjekt Hylletid optimaliserer bibliotekressurser ved å analysere hvor lenge bøker står på hentehyllen. 
                  Målet er å redusere ventetid og forbedre tilgjengeligheten av populære titler.
                </p>
              </div>
            </div>
            
            <div className="key-features">
              <h2>Nøkkelfunksjoner</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <h3>Datainnsamling</h3>
                  <p>Strukturert innsamling av data om materialer på hentehyllen</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <h3>Analyse</h3>
                  <p>Avansert analyse av hylletid og utlånsmønstre</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                  </div>
                  <h3>Visualisering</h3>
                  <p>Interaktive dashboards og rapporter</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3>Optimalisering</h3>
                  <p>Anbefalinger for forbedring av hentefrister</p>
                </div>
              </div>
            </div>
            
            <div className="login-section">
              <button className="login-button" onClick={handleLogin}>
                <span>Utforsk prototypen</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <p className="login-note">Utviklet av studenter ved OsloMet</p>
            </div>
          </div>
          
          <div className="decoration-element">
            <div className="book-stack">
              <div className="book book-1"></div>
              <div className="book book-2"></div>
              <div className="book book-3"></div>
              <div className="book book-4"></div>
              <div className="book book-5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;