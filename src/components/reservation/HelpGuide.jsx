// Updated HelpGuide.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiArrowRight, FiArrowLeft, FiInfo } from 'react-icons/fi';

function HelpGuide({ onClose, currentTab }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightElement, setHighlightElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const highlightRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);
  
  // Define help content based on current tab
  const getHelpContent = () => {
    switch (currentTab) {
      case 'oversikt':
        return [
          {
            title: 'Velkommen til Reserveringsoversikten',
            content: 'Dette er hovedsiden for reserveringer. Her kan du se statistikk og trender for reservasjoner i biblioteket.',
            highlight: '.stats-dashboard'
          },
          {
            title: 'Statistikk og nøkkeltall',
            content: 'Her ser du viktige nøkkeltall som gjennomsnittlig hentetid, andel ikke-hentet materiale, og antall aktive reservasjoner.',
            highlight: '.stats-metrics'
          },
          {
            title: 'Grafer og visualisering',
            content: 'Denne seksjonen viser trender over tid. Du kan velge mellom ukentlig, månedlig eller årlig visning.',
            highlight: '.chart-container'
          },
          {
            title: 'Eksport og utskrift',
            content: 'Bruk denne knappen for å eksportere data til CSV eller Excel, eller for å skrive ut rapporter.',
            highlight: '.print-export-menu'
          }
        ];
      case 'aktive':
        return [
          {
            title: 'Aktive reserveringer',
            content: 'Her ser du alle reserveringer i systemet. Du kan filtrere, søke og sortere for å finne spesifikke reserveringer.',
            highlight: '.reservations-section'
          },
          {
            title: 'Søk og filtrering',
            content: 'Bruk søkefeltet for å finne reserveringer basert på tittel, forfatter eller lånernummer. Filtrer på status for å se kun ventende, hentede eller utløpte reserveringer.',
            highlight: '.filter-bar'
          },
          {
            title: 'Visningsalternativer',
            content: 'Velg mellom tabell- eller kortvisning. Tabellvisning gir en kompakt oversikt, mens kortvisning viser mer detaljer for hver reservasjon.',
            highlight: '.view-controls'
          },
          {
            title: 'Kolonneinnstillinger',
            content: 'Klikk på "Kolonner" for å velge hvilke kolonner som skal vises i tabellen. Dette hjelper deg å fokusere på den informasjonen du trenger.',
            highlight: '.column-manager-dropdown'
          },
          {
            title: 'Sortering',
            content: 'Klikk på kolonneoverskriftene for å sortere tabellen. Klikk igjen for å bytte mellom stigende og synkende rekkefølge.',
            highlight: '.data-table thead'
          }
        ];
      case 'innstillinger':
        return [
          {
            title: 'Innstillinger',
            content: 'Her kan du konfigurere systeminnstillinger for reserveringer, som hentefrist og påminnelser.',
            highlight: '.settings-page'
          },
          {
            title: 'Hentefrist',
            content: 'Angi hvor mange dager en reservasjon kan vente på hentehyllen før den utløper. Standard er 7 dager.',
            highlight: '.setting-card:first-child'
          },
          {
            title: 'Påminnelser',
            content: 'Angi hvor mange dager før utløp en påminnelse skal sendes til låneren. Standard er 2 dager før utløp.',
            highlight: '.setting-card:nth-child(2)'
          },
          {
            title: 'Lagre innstillinger',
            content: 'Husk å klikke på "Lagre innstillinger" når du har gjort endringer. Endringene vil påvirke alle fremtidige reserveringer.',
            highlight: '.settings-actions'
          }
        ];
      default:
        return [
          {
            title: 'Velkommen til Reserveringssystemet',
            content: 'Dette systemet hjelper deg å administrere reserveringer i biblioteket. Bruk hjelpeknappen når som helst for å få veiledning.',
            highlight: null
          }
        ];
    }
  };
  
  const helpContent = getHelpContent();
  const totalSteps = helpContent.length;
  
  // Clean up function
  const cleanupHighlight = () => {
    // Clear any pending timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Remove highlight class from all elements
    document.querySelectorAll('.help-highlight-target').forEach(el => {
      el.classList.remove('help-highlight-target');
    });
    
    // Reset highlight element
    setHighlightElement(null);
  };
  
  // Calculate optimal tooltip position
  const calculateTooltipPosition = (targetElement) => {
    if (!targetElement || !tooltipRef.current) return { top: 0, left: 0 };
    
    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Default positioning (to the right of the element)
    let left = targetRect.right + 20;
    let top = targetRect.top;
    
    // Check if tooltip would go off-screen to the right
    if (left + tooltipRect.width > viewportWidth - 20) {
      // Position to the left of the element instead
      left = targetRect.left - tooltipRect.width - 20;
      
      // If still off-screen to the left, position below or above
      if (left < 20) {
        left = Math.max(20, (viewportWidth - tooltipRect.width) / 2);
        top = targetRect.bottom + 20;
        
        // If off-screen at bottom, position above
        if (top + tooltipRect.height > viewportHeight - 20) {
          top = targetRect.top - tooltipRect.height - 20;
        }
      }
    }
    
    // Check if tooltip would go off-screen at the bottom
    if (top + tooltipRect.height > viewportHeight - 20) {
      // Align with bottom of viewport with padding
      top = viewportHeight - tooltipRect.height - 20;
    }
    
    // Check if tooltip would go off-screen at the top
    if (top < 20) {
      top = 20;
    }
    
    return { top, left };
  };
  
  // Handle highlighting and scrolling to the element
  useEffect(() => {
    // Clean up previous highlights
    cleanupHighlight();
    
    const highlightSelector = helpContent[currentStep]?.highlight;
    if (!highlightSelector) return;
    
    // Try to find the element
    const findElement = () => {
      const element = document.querySelector(highlightSelector);
      if (element) {
        // Element found, highlight it
        setHighlightElement(element);
        
        // Scroll the element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add highlight class
        element.classList.add('help-highlight-target');
        
        // Position the highlight overlay
        if (highlightRef.current) {
          const rect = element.getBoundingClientRect();
          const highlight = highlightRef.current;
          
          // Add some padding around the element
          const padding = 10;
          
          highlight.style.top = `${rect.top - padding + window.scrollY}px`;
          highlight.style.left = `${rect.left - padding + window.scrollX}px`;
          highlight.style.width = `${rect.width + (padding * 2)}px`;
          highlight.style.height = `${rect.height + (padding * 2)}px`;
          highlight.style.opacity = '1';
          
          // Calculate and set tooltip position after a short delay
          // to ensure the highlight is positioned first
          setTimeout(() => {
            setTooltipPosition(calculateTooltipPosition(element));
          }, 100);
        }
      } else {
        // Element not found, try again after a delay
        timerRef.current = setTimeout(findElement, 200);
      }
    };
    
    // Start looking for the element
    findElement();
    
    // Clean up when component unmounts or step changes
    return cleanupHighlight;
  }, [currentStep, helpContent]);
  
  // Recalculate tooltip position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (highlightElement) {
        setTooltipPosition(calculateTooltipPosition(highlightElement));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [highlightElement]);
  
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="help-guide-overlay">
      {/* Highlight element overlay */}
      <div 
        ref={highlightRef}
        className="help-highlight-overlay"
        aria-hidden="true"
      />
      
      {/* Floating tooltip */}
      <div 
        ref={tooltipRef}
        className="help-guide-tooltip"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="help-guide-header">
          <div className="help-guide-icon">
            <FiInfo />
          </div>
          <h2>{helpContent[currentStep].title}</h2>
          <button className="help-close-button" onClick={onClose} aria-label="Lukk hjelpeguide">
            <FiX />
          </button>
        </div>
        
        <div className="help-guide-content">
          <p>{helpContent[currentStep].content}</p>
        </div>
        
        <div className="help-guide-footer">
          <div className="help-guide-progress">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index} 
                className={`progress-dot ${index === currentStep ? 'active' : ''}`}
                onClick={() => setCurrentStep(index)}
                role="button"
                aria-label={`Gå til steg ${index + 1}`}
                tabIndex={0}
              />
            ))}
          </div>
          
          <div className="help-guide-buttons">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={prevStep}>
                <FiArrowLeft className="icon" />
                Forrige
              </button>
            )}
            
            <button className="btn-primary" onClick={nextStep}>
              {currentStep < totalSteps - 1 ? (
                <>
                  Neste
                  <FiArrowRight className="icon" />
                </>
              ) : (
                'Avslutt'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

HelpGuide.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentTab: PropTypes.string.isRequired
};

export default HelpGuide;