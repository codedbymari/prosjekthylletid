import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/hjem');
  };

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="welcome-container">
          <div className="welcome-section">
            <div className="welcome-header">
              <div className="project-badge">DATA3710 Praktisk IT-prosjekt</div>
              <h1>Prosjekt <span className="highlight">Hylletid</span></h1>
              <p className="subtitle"> i samarbeid med Nordre Follo Bibliotek</p>
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
                Prosjektet har som mål å forbedre bibliotekets ressursutnyttelse ved å analysere hvor lenge materialer står uavhentet på hentehyllen. 
                Målet er å redusere ventetid og gjøre populære titler raskere tilgjengelig for utlån.


                </p>
              </div>
            </div>
            
            <div className="key-features">
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v6.5M12 13v9"></path>
                      <path d="M19 6l-7-4-7 4"></path>
                      <path d="M19 18l-7 4-7-4"></path>
                    </svg>
                  </div>
                  <h3>Datainnsamling</h3>
                  <p>Strukturert uthenting av informasjon om materialer på hentehyllen</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <h3>Analyse</h3>
                  <p>Innsikt i hvor lenge materialer blir stående, og hvordan dette varierer over tid</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                      <line x1="6" y1="6" x2="6" y2="6"></line>
                      <line x1="6" y1="18" x2="6" y2="18"></line>
                    </svg>
                  </div>
                  <h3>Visualisering</h3>
                  <p>Interaktive dashboards og rapporter som gjør dataene lettere å forstå</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                      <path d="M10 7h4"></path>
                      <path d="M7 10v4"></path>
                      <path d="M17 10v4"></path>
                      <path d="M10 17h4"></path>
                    </svg>
                  </div>
                  <h3>Systemarkitektur</h3>
                  <p>Komponentbasert frontend og backend med SQLite-database og API-er for datatilgang</p>
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
              <p className="login-note">Utviklet av studenter ved OsloMet ❤️</p>
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