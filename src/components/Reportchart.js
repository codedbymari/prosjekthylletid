import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Label } from "recharts";
import './ReportChart.css'; // Create this file for styling

// This component matches the interface expected by your dashboard
function ReportChart({ data }) {
  const [showScatterPlot, setShowScatterPlot] = useState(false);
  
  // Standardized axis label style
  const axisLabelStyle = {
    textAnchor: 'middle',
    fontSize: '14px',
    fill: '#8884d8'
  };

  // Sample scatter data - in real implementation, derive this from your dashboard data
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

  // Custom tooltip for scatter plot
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{payload[0].payload.title}</p>
          <p>Forfatter: {payload[0].payload.author}</p>
          <p>Antall på venteliste: {payload[0].payload.x}</p>
          <p>Dager på hentehylla: {payload[0].payload.y.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="report-chart-container">
      <div className="chart-toggle">
        <button 
          className={`btn-small ${!showScatterPlot ? 'active' : ''}`}
          onClick={() => setShowScatterPlot(false)}
        >
          Hentetid per periode
        </button>
        <button 
          className={`btn-small ${showScatterPlot ? 'active' : ''}`}
          onClick={() => setShowScatterPlot(true)}
        >
          Popularitet vs. hentetid
        </button>
      </div>

      <div className="chart-wrapper">
        {!showScatterPlot ? (
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
              <XAxis dataKey="periode" name="Periode" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" name="Gjennomsnittlig hentetid (dager)" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" name="Antall ikke hentet" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="antallDager" name="Gjennomsnittlig hentetid (dager)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="antallIkkeHentet" name="Antall ikke hentet" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
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
              <XAxis 
                type="number" 
                dataKey="x" 
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
              <YAxis 
                type="number" 
                dataKey="y" 
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
}

export default ReportChart;