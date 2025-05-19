# Quria Reservasjonsdashboard

Dette prosjektet er et prototype dashboard som viser statistikk over hvor lenge lånemateriale står på hentehylla i biblioteksystemet Quria. 

![image](https://github.com/user-attachments/assets/c37f9c19-af14-4d5e-8b20-34c5d3dc9a67)



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
└── src/
    ├── reportWebVitals.js
    ├── App.css
    ├── index.js
    ├── index.css
    ├── App.test.js
    ├── layout.css
    ├── setupTests.js
    ├── App.js
    ├── pages/
    │   ├── HomePage.css
    │   └── HomePage.js
    ├── utils/
    │   ├── mockData.js
    │   ├── colors.js
    │   └── dateUtils.js
    ├── components/
    │   ├── help/
    │   │   ├── HelpSection.jsx
    │   │   └── HelpSection.css
    │   ├── borrowers/
    │   │   ├── BorrowerDashboard.js
    │   │   ├── BorrowerDashboard.css
    │   │   ├── list/
    │   │   │   ├── SearchBar.js
    │   │   │   ├── ReservationsTable.js
    │   │   │   └── BorrowersList.js
    │   │   ├── detail/
    │   │   │   ├── TabNavigation.js
    │   │   │   ├── HistoryTable.js
    │   │   │   ├── BorrowerInfoCard.js
    │   │   │   ├── BorrowerDetail.js
    │   │   │   ├── MessagesSection.js
    │   │   │   ├── FavoriteGenres.js
    │   │   │   ├── ReservationsTable.js
    │   │   │   └── FavoriteAuthors.js
    │   │   ├── common/
    │   │   │   ├── LoadingIndicator.js
    │   │   │   └── NoDataMessage.js
    │   │   └── utils/
    │   │       └── formatUtils.js
    │   ├── HomeDashboard/
    │   │   ├── EventCard.js
    │   │   ├── EventEditorModal.js
    │   │   ├── BranchSwitcher.js
    │   │   ├── EventDetailsModal.js
    │   │   ├── HomeDashboard.jsx
    │   │   └── HomeDashboard.css
    │   ├── common/
    │   │   ├── LoadingSpinner.js
    │   │   ├── NoResults.js
    │   │   ├── ToastNotification.css
    │   │   ├── StatusBadge.js
    │   │   └── ToastNotification.js
    │   ├── chart/
    │   │   ├── PickupDistributionChart.js
    │   │   ├── ScatterPlot.js
    │   │   ├── ReportChart.js
    │   │   ├── ChartContainer.js
    │   │   ├── BarChart.js
    │   │   └── styles/
    │   │       ├── PickupDistributionChart.css
    │   │       ├── ChartContainer.css
    │   │       ├── BarChart.css
    │   │       └── ReportChart.css
    │   ├── layout/
    │   │   ├── Sidebar.js
    │   │   ├── Header.js
    │   │   ├── UnavailableFeatureTooltip.js
    │   │   └── styles/
    │   │       ├── UnavailableFeatureTooltip.css
    │   │       ├── Sidebar.css
    │   │       └── Header.css
    │   └── reservation/
    │       ├── helpers/
    │       │   ├── PrintableReports.js
    │       │   └── FilterBar.js
    │       ├── components/
    │       │   ├── ReservationTable.js
    │       │   ├── ExportMenu.js
    │       │   ├── VisualizationSection.js
    │       │   ├── StatisticsSection.js
    │       │   ├── SettingsPanel.js
    │       │   ├── ReserveringDashboard.js
    │       │   ├── ReservationList.js
    │       │   ├── ReservationCards.js
    │       │   └── reservasjonStatistikk.js
    │       └── styles/
    │           ├── VisualizationSection.css
    │           ├── StatisticsSection.css
    │           ├── ExportMenu.css
    │           ├── PrintableReports.css
    │           └── ReserveringDashboard.css
    └── Backend/
        └── backend/
            ├── Server.js
            ├── laaner.js
            ├── Reservasjon.sql
            ├── importerData.js
            ├── Reservasjon.js
            ├── laaner.sql
            └── database.db
