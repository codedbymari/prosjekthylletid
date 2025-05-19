import React, { useState } from 'react';
import './HelpSection.css';

function HelpSection() {
  const [activeCategory, setActiveCategory] = useState('oversikt');
  
  // Liste over alle hjelpekategorier
  const categories = [
    { id: 'oversikt', title: 'Oversikt' },
    { id: 'reservasjon', title: 'Reservering' },
    { id: 'statistikk', title: 'Statistikk og rapporter' },
    { id: 'filtrering', title: 'Filtreringsalternativer' },
    { id: 'eksport', title: 'Eksportere data' },
    { id: 'snarveier', title: 'Tastatursnarveier' },
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
        <p>Bruk sidepanelet til venstre for å navigere mellom de forskjellige modulene i systemet. Trykk på ikonet øverst til venstre for å vise/skjule sidepanelet på mobile enheter.</p>
        
        <h3>Filialbytte</h3>
        <p>Du kan bytte filial ved å:</p>
        <ol>
          <li>Klikke på brukerprofilen din øverst i sidepanelet</li>
          <li>Velge ny filial fra rullegardinmenyen</li>
        </ol>
        <p>Alternativt kan du bytte filial direkte fra hovedoversikten ved å bruke filialvelgeren øverst på dashbordet.</p>
      </div>
    ),
    
    reservasjon: (
      <div className="help-content">
        <h2>Reservasjonsmodulen</h2>
        <p>Reservasjonsmodulen gir deg oversikt over alle materialer som venter på hentehylla, og lar deg analysere hentetider og trender.</p>
        
        <h3>Reservasjonsoversikt</h3>
        <p>Her ser du alle materialer på hentehylla. Du kan:</p>
        <ul>
          <li>Filtrere materialer basert på ulike kriterier (dager på hylla, materialtype, etc.)</li>
          <li>Sortere listen ved å klikke på kolonneoverskriftene</li>
          <li>Bytte mellom liste-, kort- eller tabellvisning</li>
        </ul>
        
        <h3>Statistikk</h3>
        <p>Under statistikk-fanen kan du:</p>
        <ul>
          <li>Se gjennomsnittlig hentetid for ulike materialtyper</li>
          <li>Identifisere trender for når lånere henter materiale</li>
          <li>Sammenligne data mellom avdelinger</li>
        </ul>
        
        <h3>Administrere reservasjonsinnstillinger</h3>
        <p>Under innstillinger kan du tilpasse:</p>
        <ul>
          <li>Varsler for materialer som har stått lenge</li>
          <li>Standard statistikkvisninger</li>
          <li>Rapportformater</li>
        </ul>
      </div>
    ),
    
    statistikk: (
      <div className="help-content">
        <h2>Statistikk og rapporter</h2>
        <p>Systemet tilbyr kraftige statistikk- og rapportfunksjoner for å analysere data om hylletider.</p>
        
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
    
    filtrering: (
      <div className="help-content">
        <h2>Filtreringsalternativer</h2>
        <p>Systemet tilbyr omfattende filtreringsmuligheter for å finne akkurat den informasjonen du trenger.</p>
        
        <h3>Filtrere reservasjonsoversikten</h3>
        <p>I reservasjonsoversikten kan du filtrere på:</p>
        <ul>
          <li><strong>Dager på hylla:</strong> Antall dager materialet har stått på hentehylla</li>
          <li><strong>Materialtype:</strong> Bok, film, lydbok, etc.</li>
          <li><strong>Avdeling:</strong> Voksne, barn, etc.</li>
          <li><strong>Status:</strong> Aktiv, utløpt, etc.</li>
          <li><strong>Utlånstype:</strong> Standard, korttids, etc.</li>
        </ul>
        
        <h3>Avansert filtrering</h3>
        <p>For mer komplekse søk:</p>
        <ol>
          <li>Klikk på "Avansert filter" i filtermenyen</li>
          <li>Legg til flere filterkriterier med "+" knappen</li>
          <li>Velg logiske operatorer (AND/OR) mellom kriteriene</li>
          <li>Klikk "Anvend filter" for å utføre søket</li>
        </ol>
        
        <h3>Lagre filter</h3>
        <p>Du kan lagre dine mest brukte filtre for senere bruk:</p>
        <ol>
          <li>Sett opp filteret slik du ønsker</li>
          <li>Klikk på "Lagre filter"-ikonet</li>
          <li>Gi filteret et navn</li>
          <li>Filteret vil nå være tilgjengelig i "Lagrede filtre"-menyen</li>
        </ol>
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
        
        <h3>Automatiserte rapporter</h3>
        <p>Du kan sette opp automatiserte rapporter som sendes på e-post:</p>
        <ol>
          <li>Gå til "Innstillinger" under Reserveringsmodulen</li>
          <li>Velg "Planlagte rapporter"</li>
          <li>Klikk "Ny planlagt rapport"</li>
          <li>Definer rapporttype, format, frekvens og mottakere</li>
          <li>Klikk "Lagre"</li>
        </ol>
      </div>
    ),
    
    snarveier: (
      <div className="help-content">
        <h2>Tastatursnarveier</h2>
        <p>For å jobbe mer effektivt kan du bruke følgende tastatursnarveier:</p>
        
        <h3>Navigasjon</h3>
        <table className="shortcuts-table">
          <tbody>
            <tr>
              <td><kbd>F1</kbd></td>
              <td>Åpne denne hjelpeseksjonen</td>
            </tr>
            <tr>
              <td><kbd>Alt</kbd> + <kbd>H</kbd></td>
              <td>Gå til Hjem</td>
            </tr>
            <tr>
              <td><kbd>Alt</kbd> + <kbd>R</kbd></td>
              <td>Gå til Reservering</td>
            </tr>
            <tr>
              <td><kbd>Alt</kbd> + <kbd>L</kbd></td>
              <td>Gå til Lånere</td>
            </tr>
            <tr>
              <td><kbd>Alt</kbd> + <kbd>⇧</kbd> + <kbd>S</kbd></td>
              <td>Åpne/lukke sidepanelet</td>
            </tr>
          </tbody>
        </table>
        
        <h3>Reserveringsoversikt</h3>
        <table className="shortcuts-table">
          <tbody>
            <tr>
              <td><kbd>Ctrl</kbd> + <kbd>F</kbd></td>
              <td>Fokuser på søkefeltet</td>
            </tr>
            <tr>
              <td><kbd>Ctrl</kbd> + <kbd>⇧</kbd> + <kbd>F</kbd></td>
              <td>Åpne avansert filter</td>
            </tr>
            <tr>
              <td><kbd>Ctrl</kbd> + <kbd>E</kbd></td>
              <td>Eksporter data</td>
            </tr>
            <tr>
              <td><kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd></td>
              <td>Bytt mellom listevisning, kortvisning og tabellvisning</td>
            </tr>
          </tbody>
        </table>
        
        <h3>Generelt</h3>
        <table className="shortcuts-table">
          <tbody>
            <tr>
              <td><kbd>Esc</kbd></td>
              <td>Lukk modaler, dialoger eller menyer</td>
            </tr>
            <tr>
              <td><kbd>Ctrl</kbd> + <kbd>S</kbd></td>
              <td>Lagre endringer (hvor tilgjengelig)</td>
            </tr>
            <tr>
              <td><kbd>Ctrl</kbd> + <kbd>P</kbd></td>
              <td>Skriv ut nåværende visning</td>
            </tr>
          </tbody>
        </table>
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
          <h3>Trenger du mer hjelp?</h3>
          <p>Kontakt biblioteksystemadministrator:</p>
          <p>admin@nordrefollo.no</p>
        </div>
      </div>
      <div className="help-content-container">
        {helpContent[activeCategory]}
      </div>
    </div>
  );
}

export default HelpSection;