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
  - Javascript(JSX) språk
  - Axios for HTTP-forespørsler
  - CSS for styling (egne CSS-filer for komponentene)

- **Backend:**  
  (implementeres med MySQL, for øyeblikket brukes dummy-data)

## Prosjektstruktur
```plaintext
src tree
.
├── App.css
├── App.js
├── App.test.js
├── Backend
│   └── backend
│       ├── Reservations.js
│       ├── Reservations.sql
│       ├── Server.js
│       ├── database.db
│       ├── statements.js
│       └── statements.sql
├── components
│   ├── BorrowerDashboard.css
│   ├── BorrowerDashboard.jsx
│   ├── HomeDashboard.css
│   ├── HomeDashboard.jsx
│   ├── HomePage.css
│   ├── HomePage.jsx
│   ├── chart
│   │   ├── BarChart.css
│   │   ├── BarChart.jsx
│   │   ├── ChartContainer.css
│   │   ├── ChartContainer.jsx
│   │   ├── PickupDistributionChart.css
│   │   ├── PickupDistributionChart.jsx
│   │   ├── ReportChart.css
│   │   ├── ReportChart.jsx
│   │   └── ScatterPlot.jsx
│   ├── common
│   │   ├── LoadingSpinner.jsx
│   │   ├── NoResults.jsx
│   │   ├── StatusBadge.jsx
│   │   └── ToastNotification.jsx
│   ├── layout
│   │   ├── Header.css
│   │   ├── Header.js
│   │   ├── Sidebar.css
│   │   └── Sidebar.js
│   └── reservation
│       ├── ExportMenu.css
│       ├── ExportMenu.jsx
│       ├── FilterBar.jsx
│       ├── PrintableReports.css
│       ├── PrintableReports.jsx
│       ├── ReservationCards.jsx
│       ├── ReservationList.jsx
│       ├── ReservationTable.jsx
│       ├── ReserveringDashboard.css
│       ├── ReserveringDashboard.jsx
│       ├── SettingsPanel.jsx
│       ├── StatisticsSection.css
│       ├── StatisticsSection.jsx
│       ├── VisualizationSection.css
│       └── VisualizationSection.jsx
├── index.css
├── index.js
├── layout.css
├── mockData.js
├── reportWebVitals.js
├── setupTests.js
└── utils
    ├── colors.js
    └── dateUtils.js

9 directories, 55 files
