// src/components/chart/ScatterPlot.jsx
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import './BarChart.css'; // Reuse the same CSS

const ScatterPlot = ({ 
  containerWidth = 600, 
  containerHeight = 400,
}) => {
  // Default scatter data - ensure this is available
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
          <p>
            <span className="tooltip-label">Forfatter:</span>
            <span className="tooltip-value">{payload[0].payload.author}</span>
          </p>
          <p>
            <span className="tooltip-label">Antall på venteliste:</span>
            <span className="tooltip-value">{payload[0].payload.x}</span>
          </p>
          <p>
            <span className="tooltip-label">Dager på hentehylla:</span>
            <span className="tooltip-value">{payload[0].payload.y.toFixed(1)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate margins based on container width
  const getMargins = () => {
    if (containerWidth < 500) {
      return { top: 20, right: 30, left: 40, bottom: 60 };
    } else if (containerWidth < 768) {
      return { top: 20, right: 40, left: 50, bottom: 60 };
    }
    return { top: 20, right: 50, left: 60, bottom: 60 };
  };

  // Add console.log to debug rendering
  console.log("Rendering ScatterPlot with data:", scatterData);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={getMargins()}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={[0, 1700]}
            tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
            tickFormatter={(value) => value > 999 ? `${(value/1000).toFixed(1)}k` : value}
            height={40}
          >
            <Label 
              value="Antall lånere på venteliste" 
              position="bottom" 
              style={{ fill: '#8884d8', fontSize: containerWidth < 500 ? '10px' : '12px' }}
              offset={20}
            />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="y" 
            domain={[0, 6]}
            tick={{ fontSize: containerWidth < 500 ? 10 : 12 }}
            tickFormatter={(value) => value.toFixed(1)}
            width={55}
          >
            <Label 
              value="Dager på hentehylla" 
              position="insideLeft"
              angle={-90} 
              style={{ fill: '#8884d8', fontSize: containerWidth < 500 ? '10px' : '12px' }}
              offset={-40}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Scatter 
            name="Bok Popularitet" 
            data={scatterData} 
            fill="#8884d8" 
            fillOpacity={0.8}
            shape="circle"
            legendType="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;