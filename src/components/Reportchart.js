import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Label } from "recharts";

// Oppdatert BarChart-komponent med samme marginer som ScatterChart
function ReportChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 55,
          bottom: 45,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dag" name="Ukedag" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" name="Gjennomsnittlig hentetid (dager)" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" name="Antall ikke hentet" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="antallDager" name="Gjennomsnittlig hentetid (dager)" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="antallIkkeHentet" name="Antall ikke hentet" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Tilpasset tooltip-komponent for scatterplot
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ 
        backgroundColor: '#fff', 
        padding: '10px', 
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
      }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{payload[0].payload.title}</p>
        <p style={{ margin: '0 0 5px 0' }}>Forfatter: {payload[0].payload.author}</p>
        <p style={{ margin: '0 0 5px 0' }}>Antall på venteliste: {payload[0].payload.x}</p>
        <p style={{ margin: '0' }}>Dager på hentehylla: {payload[0].payload.y.toFixed(1)}</p>
      </div>
    );
  }
  return null;
};

// Oppdatert scatterData med tydelig negativ korrelasjon
const scatterData = [
  { x: 1600, y: 1.0, title: 'Tørt land', author: 'Jørn Lier Horst' },
  { x: 1500, y: 1.2, title: 'Kongen av Os', author: 'Jo Nesbø' },
  { x: 1450, y: 1.5, title: 'Sjøfareren', author: 'Erika Fatland' },
  { x: 1300, y: 1.8, title: 'Skriket', author: 'Jørn Lier Horst og Jan-Erik Fjell' },
  { x: 1200, y: 2.1, title: 'Råsterk på et år', author: 'Jørgine Massa Vasstrand' },
  { x: 900, y: 2.8, title: 'Lur familiemat', author: 'Ida Gran-Jansen' },
  { x: 800, y: 3.2, title: '23 meter offside (Pondus)', author: 'Frode Øverli' },
  { x: 600, y: 3.9, title: 'Felix har følelser', author: 'Charlotte Mjelde' },
  { x: 400, y: 4.5, title: 'Juleroser', author: 'Herborg Kråkevik' },
  { x: 250, y: 5.3, title: 'Søvngjengeren', author: 'Lars Kepler' }
];

const Charts = () => {
  const [isBarChart, setIsBarChart] = useState(true); // State for å toggle mellom BarChart og ScatterChart

  const toggleChart = () => {
    setIsBarChart(!isBarChart); // Bytt mellom BarChart og ScatterChart
  };

  // Data for BarChart med ukedager
  const barData = [
    { dag: 'Mandag', antallDager: 4, antallIkkeHentet: 2 },
    { dag: 'Tirsdag', antallDager: 5, antallIkkeHentet: 3 },
    { dag: 'Onsdag', antallDager: 6, antallIkkeHentet: 1 },
    { dag: 'Torsdag', antallDager: 3, antallIkkeHentet: 4 },
    { dag: 'Fredag', antallDager: 7, antallIkkeHentet: 2 },
  ];

  // Felles stil for container for å sikre konsistent plassering
  const chartContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '400px'
  };

  // Definere en felles stil for aksetitlene
  const axisLabelStyle = {
    textAnchor: 'middle',
    fontSize: '14px', // Økt fra 13px til 14px for å matche BarChart legend
    fill: '#8884d8'   // Endret fra #666 til #8884d8 for å matche den lilla fargen
  };

  return (
    <div>
      {/* Toggle button for switching charts */}
      <button onClick={toggleChart} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
        {isBarChart ? 'Vis ScatterPlot' : 'Vis BarChart'}
      </button>

      {/* Container med konsistent stil */}
      <div style={chartContainerStyle}>
        {/* BarChart eller ScatterChart basert på state */}
        {isBarChart ? (
          <ReportChart data={barData} />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 30,
                left: 55,
                bottom: 45,
              }}
            >
              <CartesianGrid />
              {/* Oppdatert XAxis med ny labelstil */}
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Antall på venteliste" 
                domain={[0, 1700]}
                allowDataOverflow={false}
              >
                <Label 
                  value="Antall lånere på venteliste" 
                  position="bottom" 
                  style={axisLabelStyle} 
                  dy={20} 
                />
              </XAxis>
              {/* Oppdatert YAxis med ny labelstil */}
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Antall dager på hentehylla" 
                domain={[0, 6]}
                allowDataOverflow={false}
              >
                <Label 
                  value="Antall dager på hentehylla" 
                  position="left" 
                  angle={-90} 
                  style={axisLabelStyle} 
                  dx={-35} 
                />
              </YAxis>
              {/* Bruk av egendefinert tooltip-komponent */}
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter 
                name="Bok Popularitet" 
                data={scatterData} 
                fill="#8884d8" 
                shape="circle"
                fillOpacity={0.8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Charts;