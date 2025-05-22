import React, { useState } from 'react';
import './HelpSection.css';

function HelpSection() {
  const [activeCategory, setActiveCategory] = useState('oversikt');
  
  // Liste over alle hjelpekategorier
  const categories = [
    { id: 'oversikt', title: 'Oversikt' },
    { id: 'reservasjon', title: 'Reservering' },
    { id: 'statistikk', title: 'Statistikk og rapporter' },
    { id: 'eksport', title: 'Eksportere data' },
  ];
  
  // Innhold for hver kategori
  const helpContent = {
    oversikt: (
      <div className="help-content">
        <h2>Hylletid - Oversikt</h2>
        <p>Hylletid-systemet er utviklet for Nordre Follo Bibliotek for å analysere og optimalisere tida materiale står på hentehylla.</p>
        
        <h3>Hovedfunksjoner</h3>
        <ul>
          <li><strong>Reservasjonsoversikt:</strong> Se og filtrer materialer på hentehylla</li>
          <li><strong>Statistikk og visualisering:</strong> Analyser trender og hentetider</li>
          <li><strong>Rapporter:</strong> Eksporter data og generer tilpassede rapporter</li>
        </ul>
        
        <h3>Navigasjon</h3>
        <p>Bruk sidepanelet til venstre for å navigere mellom de forskjellige sidene i systemet. Trykk på ikonet nede til venstre for å vise/skjule sidepanelet.</p>
        
        <h3>Filialbytte</h3>
        <p>Du kan bytte filial ved å:</p>
        <ol>
          <li>Klikke på brukerprofilen din øverst i sidepanelet</li>
          <li>Velge ny filial fra rullegardinmenyen</li>
        </ol>
        <p>Alternativt kan du bytte filial direkte fra hjemsiden ved å bruke filialvelgeren øverst på dashbordet.</p>
      </div>
    ),
    
    reservasjon: (
      <div className="help-content">
        <h2>Reservasjonssiden</h2>
        <p> Reservasjonssiden gir deg oversikt over alle materialer som venter på hentehylla, og lar deg analysere hentetider og trender.</p>
        
        <h3>Reservasjonsoversikt</h3>
        <p>Her ser du alle materialer på hentehylla. Du kan:</p>
        <ul>
          <li>Filtrere materialer basert på ulike kriterier (dager på hylla,tittle ,status etc.)</li>
          <li>Sortere listen ved å klikke på kolonneoverskriftene</li>
          <li>Bytte mellom kort- eller tabellvisning</li>
        </ul>
        
        <h3>Statistikk</h3>
        <p>Under statistikkoversikten  kan du:</p>
        <ul>
          <li>Se gjennomsnittlig hentetid for ulike materialtyper</li>
          <li>Identifisere trender for når lånere henter materiale</li>
          <li> og mye mer med diagrammene som er visualisert</li>
        </ul>
        
        <h3>Administrere reservasjonsinnstillinger</h3>
        <p>Under innstillinger kan du tilpasse:</p>
        <ul>
          <li>Hentefrist</li>
          <li>Påminnelse: Antall dager før hentefrist som </li>
          <p> påminnelse sendes automatisk til låner.</p>
        </ul>
      </div>
    ),
    
    statistikk: (
      <div className="help-content">
        <h2>Statistikk og rapporter</h2>
        <p>Systemet tilbyr  statistikk- og rapportfunksjoner for å analysere data om hylletider.</p>
        
        <h3>Tilgjengelige grafer</h3>
        <ul>
          <li><strong>Søylediagram:</strong> Sammenligne hentetider mellom materialtyper eller filial</li>
          <li><strong>Linjediagram:</strong> Se trender over tid</li>
          <li><strong>Fordelingsdiagram:</strong> Visualisere distribusjonen av hentetider</li>
        </ul>
        
        <h3>Rapportgenerering</h3>
        <p>For å generere en rapport:</p>
        <ol>
          <li>Gå til Reservering {'>'} Oversikt</li>
          <li>Klikk på "Eksporter" i verktøylinjen</li>
          <li>Velg rapporttype og format (Excel, PDF, CSV)</li>
          <li>Definer datautvalg og filtre</li>
          <li>Klikk "Generer rapport"</li>
        </ol>
        
        <h3>Forhåndsdefinerte rapporter</h3>
        <p>Systemet har flere forhåndsdefinerte rapporter:</p>
        <ul>
          <li><strong>Materialer over forventet hentetid:</strong> Materialer som har stått lenger enn gjennomsnittet</li>
          <li><strong>Filialsammenligning:</strong> Sammenligner hentetider på tvers av filialer</li>
          <li><strong>Ukentlig oversikt:</strong> Oppsummering av aktivitet siste uke</li>
        </ul>
      </div>
    ),
    
    
   
    
    eksport: (
      <div className="help-content">
        <h2>Eksportere data</h2>
        <p>Systemet lar deg eksportere data i flere formater for videre analyse eller rapportering.</p>
        
        <h3>Eksportformater</h3>
        <ul>
          <li><strong>Excel (.xlsx):</strong> Full formatering med flere ark og grafer</li>
          <li><strong>PDF:</strong> Formattert rapport klar for utskrift eller deling</li>
          <li><strong>CSV:</strong> Rådata for import i andre analyseverktøy</li>
        </ul>
        
        <h3>Slik eksporterer du data</h3>
        <ol>
          <li>Naviger til ønsket visning (for eksempel Reservering {'>'} Oversikt)</li>
          <li>Anvend eventuelle filtre for å begrense dataomfanget</li>
          <li>Klikk på "Eksport"-knappen i verktøylinjen</li>
          <li>Velg ønsket format</li>
          <li>Konfigurer eventuelle eksportinnstillinger</li>
          <li>Klikk "Eksporter"</li>
        </ol>
        
   
      </div>
    )
    
    
  };
  
  return (
    <div className="help-section">
      <div className="help-sidebar">
        <h2>Hjelp og veiledning</h2>
        <ul className="help-categories">
          {categories.map(category => (
            <li 
              key={category.id} 
              className={activeCategory === category.id ? 'active' : ''}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.title}
            </li>
          ))}
        </ul>
        <div className="help-contact">
   
        </div>
      </div>
      <div className="help-content-container">
        {helpContent[activeCategory]}
      </div>
    </div>
  );
}

export default HelpSection;