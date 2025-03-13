# Quria Reservasjonsdashboard

Dette prosjektet er et prototype dashboard som viser statistikk over hvor lenge lånemateriale står på hentehylla i biblioteksystemet Quria. 

## Innhold

- [Om prosjektet](#om-prosjektet)
- [Funksjonalitet](#funksjonalitet)
- [Teknologier](#teknologier)
- [Prosjektstruktur](#prosjektstruktur)

## Om prosjektet

Dette dashboardet er utviklet for å gi bibliotekarer en visuell oversikt over reserveringsdata. Dashboardet henter data (i utgangspunktet dummy-data) for å vise hvor lenge materialet har stått på hentehylla. Statistikkene gir innsikt i:

- Antall dager materialet venter på henting.
- Totalt antall materialer på hentehylla.
- Andelen materialer som faktisk hentes innen fastsatt frist.

Basert på denne statistikken kan bibliotekarer ta informerte beslutninger om hvor lang hentefristen bør være.

## Funksjonalitet

- **Statistikkvisning:**  
  Dashboardet viser et diagram og en tabell med nøkkeltall for reserveringer.
  
- **Rapportgenerering:**  
  Mulighet for å generere en rapport basert på tidsperiode (f.eks. siste 7, 30 eller 90 dager).
  
- **Purremelding:**  
  Funksjonalitet for å sende påminnelse (purrevarsel) til lånere dersom hentefristen nærmer seg.

## Teknologier

- **Frontend:**  
  - React (opprettet med Create React App)
  - Axios for HTTP-forespørsler
  - CSS for styling (egne CSS-filer for komponentene)

- **Backend:**  
  (Skal implementeres med Express og MySQL – for øyeblikket brukes dummy-data)
  - Express
  - MySQL2
  - CORS
  - Dotenv

## Prosjektstruktur

```plaintext
.
├── server
│   └── server.js               # Express backend-server (eventuelt i en egen mappe)
├── public                      # Offentlige ressurser for React
├── src
│   ├── components              # React-komponenter
│   │   ├── Header.js           # Header-komponent
│   │   ├── Header.css          # Styling for header
│   │   ├── Sidebar.js          # Sidebar-komponent
│   │   ├── Sidebar.css         # Styling for sidebar
│   │   ├── Reportchart.js      # Diagramkomponent for visning av rapportdata
│   │   ├── ReservationDashboard.js  # Hovedkomponenten for dashboardet
│   │   └── ReserveringDashboard.css # Styling for dashboardet
│   ├── dummyData.js            # Dummy-data for testing
│   ├── App.js                  # Hoved-React-komponent
│   ├── App.css                 # Globale stiler for appen
│   ├── index.js                # React-entry point
│   ├── index.css               # Globale stiler
│   └── ...                     # Andre filer som test,
