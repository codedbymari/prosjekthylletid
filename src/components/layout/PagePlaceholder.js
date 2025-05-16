import React, { useState } from 'react';
import './PagePlaceholder.css';



const PagePlaceholder = ({ pageName, customMessage, onBack, onHome }) => {
  // Map page routes to themed content
  const pageThemes = {
    '/samlinger': {
      title: 'Samlinger',
      icon: '📚',
      color: '#8c5e58',
      message: 'Her vil du kunne bla gjennom og administrere bibliotekets samlinger.',
      illustration: (
        <div className="placeholder-illustration books">
          <div className="book book1"></div>
          <div className="book book2"></div>
          <div className="book book3"></div>
          <div className="stack"></div>
        </div>
      )
    },
    '/innkjøp': {
      title: 'Innkjøp',
      icon: '🛒',
      color: '#2b7d62',
      message: 'Her vil du kunne håndtere innkjøp av nye bøker og medier til biblioteket.',
      illustration: (
        <div className="placeholder-illustration shopping">
          <div className="cart"></div>
          <div className="book-item"></div>
          <div className="book-item"></div>
        </div>
      )
    },
    '/fjernlån': {
      title: 'Fjernlån',
      icon: '🚚',
      color: '#486591',
      message: 'Her vil du kunne administrere lån fra andre bibliotek.',
      illustration: (
        <div className="placeholder-illustration delivery">
          <div className="truck"></div>
          <div className="package"></div>
        </div>
      )
    },
    '/arrangementer': {
      title: 'Arrangementer',
      icon: '🎭',
      color: '#86568f',
      message: 'Her vil du kunne planlegge og administrere bibliotekets arrangementer.',
      illustration: (
        <div className="placeholder-illustration events">
          <div className="calendar"></div>
          <div className="event"></div>
        </div>
      )
    },
    '/statistikk': {
      title: 'Statistikk',
      icon: '📊',
      color: '#5b8c3e',
      message: 'Her vil du kunne se statistikk over utlån og andre aktiviteter.',
      illustration: (
        <div className="placeholder-illustration stats">
          <div className="chart bar1"></div>
          <div className="chart bar2"></div>
          <div className="chart bar3"></div>
        </div>
      )
    },
    '/oppsett': {
      title: 'Oppsett',
      icon: '⚙️',
      color: '#6b6b6b',
      message: 'Her vil du kunne konfigurere systeminnstillinger.',
      illustration: (
        <div className="placeholder-illustration settings">
          <div className="gear gear1"></div>
          <div className="gear gear2"></div>
        </div>
      )
    },
    '/hjelp': {
      title: 'Hjelp',
      icon: '❓',
      color: '#7d203a',
      message: 'Her finner du brukerveiledninger og hjelp til å bruke systemet.',
      illustration: (
        <div className="placeholder-illustration help">
          <div className="question-mark"></div>
          <div className="book-open"></div>
        </div>
      )
    },
    // Default for any other pages
    'default': {
      title: 'Under utvikling',
      icon: '🏗️',
      color: '#646464',
      message: 'Denne delen av systemet er under utvikling.',
      illustration: (
        <div className="placeholder-illustration construction">
          <div className="building"></div>
          <div className="crane"></div>
        </div>
      )
    }
  };

  // Get the theme for this page, or use default if not found
  const theme = pageThemes[pageName] || pageThemes['default'];
  
  // Animation state for "magic sparkle" effect when clicked
  const [showMagic, setShowMagic] = useState(false);
  
  const triggerMagicEffect = () => {
    setShowMagic(true);
    setTimeout(() => setShowMagic(false), 700);
  };
  
  return (
    <div className="page-placeholder" style={{ 
      '--theme-color': theme.color,
      '--light-theme-color': `${theme.color}22`,
    }}>
      <div className="placeholder-content">
        <div className="placeholder-header">
          <div 
            className="placeholder-icon" 
            onClick={triggerMagicEffect}
          >
            {theme.icon}
            {showMagic && <div className="magic-effect"></div>}
          </div>
          <h2>{theme.title}</h2>
        </div>
        
        <div className="placeholder-illustration-container">
          {theme.illustration}
        </div>
        
        <p className="placeholder-message">
          {customMessage || theme.message}
        </p>
        
        <div className="placeholder-actions">
          <button 
            className="placeholder-button back-button"
            onClick={onBack}
          >
            Gå tilbake
          </button>
          
          <button 
            className="placeholder-button home-button"
            onClick={onHome}
          >
            Til forsiden
          </button>
        </div>
        
        <div className="placeholder-footnote">
        Funksjonaliteten på denne siden er ikke inkludert i prototypen. 
                </div>
      </div>
      
    </div>
  );
};

export default PagePlaceholder;